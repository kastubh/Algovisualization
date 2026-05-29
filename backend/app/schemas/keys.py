from pydantic import BaseModel, Field


class ApiKeyUpsert(BaseModel):
    provider: str = Field(min_length=2, max_length=50)
    api_key: str = Field(min_length=4, max_length=400)


class ApiKeyRead(BaseModel):
    provider: str
    key_hint: str | None = None
    saved: bool = True
