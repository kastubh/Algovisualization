from app.schemas.viz import VisualizationData


def validate_visualization(payload: dict) -> VisualizationData:
    return VisualizationData.model_validate(payload)


def sample_visualization(algorithm_text: str) -> dict:
    values = [64, 34, 25, 12, 22, 11, 90]
    states = [
        ([34, 64, 25, 12, 22, 11, 90], [0, 1], [0, 1], "Compare and swap"),
        ([34, 25, 64, 12, 22, 11, 90], [1, 2], [1, 2], "Move larger value right"),
        ([34, 25, 12, 64, 22, 11, 90], [2, 3], [2, 3], "Continue bubbling"),
        ([25, 34, 12, 22, 11, 64, 90], [0, 1], [0, 1], "Start next pass"),
        ([25, 12, 22, 11, 34, 64, 90], [1, 2], [1, 2], "Place next larger value"),
        ([12, 22, 11, 25, 34, 64, 90], [0, 1], [0, 1], "Narrow the unsorted area"),
        ([12, 11, 22, 25, 34, 64, 90], [1, 2], [1, 2], "Swap remaining pair"),
        ([11, 12, 22, 25, 34, 64, 90], [0, 1], [0, 1], "Array is sorted"),
    ]
    return {
        "algorithm_name": "Bubble Sort Demo",
        "algorithm_type": "sorting",
        "description": f"Demo visualization for: {algorithm_text[:120]}. It shows adjacent comparisons and swaps until the array is sorted.",
        "time_complexity": "O(n^2)",
        "space_complexity": "O(1)",
        "initial_state": {"type": "array", "data": values},
        "steps": [
            {
                "step_number": index,
                "title": title,
                "description": "Highlighted items are compared; when out of order they swap positions.",
                "action": "swap" if swap else "compare",
                "highlights": highlights,
                "swap": swap,
                "state": {"type": "array", "data": data},
                "pointer": None,
                "code_line": None,
            }
            for index, (data, highlights, swap, title) in enumerate(states, start=1)
        ],
    }
