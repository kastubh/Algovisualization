from pydantic import BaseModel, Field


class TutorScriptRequest(BaseModel):
    provider: str = Field(min_length=2, max_length=50)
    model: str = Field(min_length=2, max_length=100)
    api_key: str | None = Field(default=None, max_length=400)
    voice_style: str = "friendly"


class NarrationStep(BaseModel):
    step_number: int
    spoken_text: str
    key_highlight: str
    duration_hint_seconds: float
    emphasis_words: list[str] = Field(default_factory=list)


class TutorScriptResponse(BaseModel):
    visualization_id: str
    algorithm_name: str
    intro_text: str
    steps: list[NarrationStep]
    outro_text: str
    total_estimated_seconds: float
