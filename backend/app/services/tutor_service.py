import json
from json import JSONDecodeError
from math import ceil

import litellm
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.algorithm_history import AlgorithmHistory
from app.schemas.tutor import NarrationStep, TutorScriptResponse
from app.services.llm_service import LLMServiceError, _friendly_llm_error, _loads_json_response

TUTOR_SYSTEM_PROMPT = """
You are an enthusiastic computer science professor explaining algorithms to students.
Return ONLY valid raw JSON. No markdown, no headings, no extra text.

Rules:
- spoken_text must be natural spoken English.
- Each spoken_text should be 1 to 3 short sentences.
- Use friendly phrases like "Notice how", "Watch what happens", "Now we", or "See how".
- duration_hint_seconds = word count of spoken_text divided by 2.5.
- emphasis_words: pick 1 to 3 important words from spoken_text.
- intro_text: one welcoming sentence naming the algorithm.
- outro_text: one sentence congratulating the student and summarizing the result.

JSON output schema:
{
  "algorithm_name": "string",
  "intro_text": "string",
  "outro_text": "string",
  "steps": [
    {
      "step_number": 1,
      "spoken_text": "string",
      "key_highlight": "max 8 words",
      "duration_hint_seconds": 4.0,
      "emphasis_words": ["word"]
    }
  ]
}
"""


def _duration_hint(text: str) -> float:
    return max(2.0, round(len(text.split()) / 2.5, 1))


def _fallback_tutor_script(visualization_id: str, viz_data: dict) -> TutorScriptResponse:
    steps = []
    for step in viz_data.get("steps", []):
        spoken = step.get("description") or step.get("title") or "Watch this step in the algorithm."
        steps.append(
            NarrationStep(
                step_number=step.get("step_number", len(steps) + 1),
                spoken_text=spoken,
                key_highlight=(step.get("title") or "Algorithm step")[:60],
                duration_hint_seconds=_duration_hint(spoken),
                emphasis_words=[word.strip(".,").lower() for word in spoken.split()[:2]],
            )
        )
    total = sum(step.duration_hint_seconds for step in steps)
    name = viz_data.get("algorithm_name", "Algorithm")
    return TutorScriptResponse(
        visualization_id=visualization_id,
        algorithm_name=name,
        intro_text=f"Welcome. Let's walk through {name} together.",
        steps=steps,
        outro_text=f"Great work. You have seen how {name} progresses step by step.",
        total_estimated_seconds=total,
    )


class TutorService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate_tutor_script(
        self,
        visualization_id: str,
        user_id: str,
        provider: str,
        model: str,
        api_key: str,
        voice_style: str = "friendly",
    ) -> TutorScriptResponse:
        history = await self.db.scalar(
            select(AlgorithmHistory).where(AlgorithmHistory.id == visualization_id, AlgorithmHistory.user_id == user_id)
        )
        if history is None:
            raise HTTPException(status_code=404, detail="Visualization not found")

        viz_data = history.viz_steps
        if api_key.lower().startswith("demo"):
            return _fallback_tutor_script(visualization_id, viz_data)

        steps_summary = json.dumps(
            {
                "algorithm_name": viz_data.get("algorithm_name"),
                "algorithm_type": viz_data.get("algorithm_type"),
                "steps": [
                    {
                        "step_number": step.get("step_number"),
                        "title": step.get("title"),
                        "description": step.get("description"),
                        "action": step.get("action"),
                    }
                    for step in viz_data.get("steps", [])
                ],
            }
        )

        user_prompt = f"""
Convert this algorithm visualization into a spoken tutor narration script.
Voice style: {voice_style}

VISUALIZATION DATA:
{steps_summary}

Return ONLY the JSON object as specified.
"""
        try:
            response = await litellm.acompletion(
                model=f"{provider}/{model}",
                api_key=api_key,
                messages=[
                    {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=1600,
                response_format={"type": "json_object"},
            )
            data = _loads_json_response(response.choices[0].message.content)
            steps = [NarrationStep(**step) for step in data["steps"]]
        except (JSONDecodeError, KeyError, TypeError, ValidationError) as exc:
            raise LLMServiceError("The provider responded, but not with a valid tutor script. Try again or use demo-local-key.", 422) from exc
        except Exception as exc:
            raise _friendly_llm_error(exc) from exc

        total_seconds = sum(step.duration_hint_seconds for step in steps)
        return TutorScriptResponse(
            visualization_id=visualization_id,
            algorithm_name=data.get("algorithm_name", viz_data.get("algorithm_name", "Algorithm")),
            intro_text=data.get("intro_text", "Welcome. Let's walk through this algorithm together."),
            steps=steps,
            outro_text=data.get("outro_text", "Great work. You finished the AI tutor walkthrough."),
            total_estimated_seconds=ceil(total_seconds),
        )
