from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.viz import VisualizationData


class VisualizeRequest(BaseModel):
    algorithm_text: str = Field(min_length=3, max_length=5000)
    provider: str = Field(min_length=2, max_length=50)
    model: str = Field(min_length=2, max_length=100)
    api_key: str | None = Field(default=None, max_length=400)


class VisualizeResponse(BaseModel):
    history_id: str
    viz_data: VisualizationData
    tokens_used: int | None = None
    processing_ms: int | None = None


class HistoryItem(BaseModel):
    id: str
    title: str | None
    algorithm_type: str | None
    llm_provider: str
    step_count: int | None
    created_at: datetime
    is_public: bool

    model_config = {"from_attributes": True}


class HistoryList(BaseModel):
    items: list[HistoryItem]
    total: int
    page: int
    pages: int


class HistoryDetail(HistoryItem):
    algorithm_text: str
    llm_model: str
    viz_data: VisualizationData


class ShareResponse(BaseModel):
    share_token: str
    url: str
