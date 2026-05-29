from typing import Any, Literal

from pydantic import BaseModel, Field

AlgorithmType = Literal["sorting", "searching", "tree", "graph", "linked_list", "other"]


class VizState(BaseModel):
    type: str
    data: Any


class VizStep(BaseModel):
    step_number: int
    title: str
    description: str
    action: str
    highlights: list[Any] = Field(default_factory=list)
    swap: list[int] | None = None
    state: VizState
    pointer: int | str | None = None
    code_line: int | None = None


class VisualizationData(BaseModel):
    algorithm_name: str
    algorithm_type: AlgorithmType
    description: str
    time_complexity: str
    space_complexity: str
    initial_state: VizState
    steps: list[VizStep] = Field(min_length=1, max_length=30)
