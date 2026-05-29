import json
from json import JSONDecodeError
import re
from time import perf_counter

import litellm
from pydantic import ValidationError

from app.services.viz_service import sample_visualization, validate_visualization

SYSTEM_PROMPT = """
You are AlgoViz, an algorithm explanation engine.
You must respond with ONLY raw JSON. Do not include markdown fences, prose, headings, or explanations.
The JSON must match this shape:
{
  "algorithm_name": "string",
  "algorithm_type": "sorting|searching|tree|graph|linked_list|other",
  "description": "string",
  "time_complexity": "string",
  "space_complexity": "string",
  "initial_state": {"type": "array|tree|graph", "data": []},
  "steps": [
    {
      "step_number": 1,
      "title": "string",
      "description": "string",
      "action": "compare|swap|visit|insert|delete|highlight|mark_sorted",
      "highlights": [],
      "swap": null,
      "state": {"type": "array|tree|graph", "data": []},
      "pointer": null,
      "code_line": null
    }
  ]
}
Use at most 12 steps. Every step must include the full state after that step.
"""


class LLMServiceError(Exception):
    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def _friendly_llm_error(error: Exception) -> LLMServiceError:
    raw = str(error)
    lowered = raw.lower()
    if "quota" in lowered or "rate limit" in lowered or "429" in lowered or "resource_exhausted" in lowered:
        return LLMServiceError(
            "Gemini quota/rate limit reached for this API key or model. Try another Gemini model, wait and retry, or enable billing/quota in Google AI Studio.",
            429,
        )
    if "api key" in lowered or "authentication" in lowered or "permission" in lowered or "401" in lowered or "403" in lowered:
        return LLMServiceError("The provider rejected the API key or project permissions. Check the key and provider settings.", 401)
    return LLMServiceError("The LLM provider could not generate visualization data right now.", 502)


def _loads_json_response(raw: str) -> dict:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start >= 0 and end > start:
            return json.loads(cleaned[start : end + 1])
        raise


async def generate_visualization(algorithm_text: str, provider: str, model: str, api_key: str) -> tuple[dict, int | None, int]:
    started = perf_counter()
    if api_key.lower().startswith("demo"):
        viz_data = validate_visualization(sample_visualization(algorithm_text)).model_dump()
        return viz_data, 0, int((perf_counter() - started) * 1000)

    try:
        response = await litellm.acompletion(
            model=f"{provider}/{model}",
            api_key=api_key,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Return JSON only for this algorithm visualization:\n\n{algorithm_text}"},
            ],
            temperature=0.2,
            max_tokens=1800,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        viz_data = validate_visualization(_loads_json_response(raw)).model_dump()
    except (JSONDecodeError, ValidationError) as exc:
        raise LLMServiceError("The provider responded, but not with valid visualization JSON. Try again or use a stronger model.", 422) from exc
    except Exception as exc:
        raise _friendly_llm_error(exc) from exc

    tokens = getattr(getattr(response, "usage", None), "total_tokens", None)
    return viz_data, tokens, int((perf_counter() - started) * 1000)
