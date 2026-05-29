from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.algorithm_history import AlgorithmHistory
from app.models.api_key import UserApiKey
from app.models.user import User
from app.schemas.algorithm import HistoryDetail, HistoryItem, HistoryList, VisualizeRequest, VisualizeResponse
from app.services.encryption_service import decrypt_key
from app.services.llm_service import LLMServiceError, generate_visualization

router = APIRouter(prefix="/algorithms", tags=["algorithms"])


@router.post("/visualize", response_model=VisualizeResponse)
async def visualize(payload: VisualizeRequest, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> VisualizeResponse:
    api_key = payload.api_key
    if not api_key:
        saved_key = await db.scalar(select(UserApiKey).where(UserApiKey.user_id == user.id, UserApiKey.provider == payload.provider.lower()))
        if saved_key is None:
            raise HTTPException(status_code=402, detail=f"No API key found for provider '{payload.provider}'. Please add one.")
        api_key = decrypt_key(saved_key.encrypted_key)

    try:
        viz_data, tokens_used, processing_ms = await generate_visualization(payload.algorithm_text, payload.provider.lower(), payload.model, api_key)
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    history = AlgorithmHistory(
        user_id=user.id,
        title=viz_data["algorithm_name"],
        algorithm_text=payload.algorithm_text,
        algorithm_type=viz_data["algorithm_type"],
        llm_provider=payload.provider.lower(),
        llm_model=payload.model,
        viz_steps=viz_data,
        step_count=len(viz_data["steps"]),
        tokens_used=tokens_used,
        processing_ms=processing_ms,
    )
    db.add(history)
    await db.commit()
    await db.refresh(history)
    return VisualizeResponse(history_id=history.id, viz_data=viz_data, tokens_used=tokens_used, processing_ms=processing_ms)


@router.get("/history", response_model=HistoryList)
async def history(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HistoryList:
    filters = [AlgorithmHistory.user_id == user.id]
    if search:
        pattern = f"%{search}%"
        filters.append(or_(AlgorithmHistory.title.ilike(pattern), AlgorithmHistory.algorithm_text.ilike(pattern)))
    total = await db.scalar(select(func.count()).select_from(AlgorithmHistory).where(*filters)) or 0
    rows = (
        await db.scalars(
            select(AlgorithmHistory)
            .where(*filters)
            .order_by(AlgorithmHistory.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
    ).all()
    return HistoryList(items=[HistoryItem.model_validate(row) for row in rows], total=total, page=page, pages=max(1, ceil(total / limit)))


@router.get("/history/{history_id}", response_model=HistoryDetail)
async def history_detail(history_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> HistoryDetail:
    row = await db.scalar(select(AlgorithmHistory).where(AlgorithmHistory.id == history_id, AlgorithmHistory.user_id == user.id))
    if row is None:
        raise HTTPException(status_code=404, detail="Visualization not found")
    return HistoryDetail(
        id=row.id,
        title=row.title,
        algorithm_type=row.algorithm_type,
        llm_provider=row.llm_provider,
        step_count=row.step_count,
        created_at=row.created_at,
        is_public=row.is_public,
        algorithm_text=row.algorithm_text,
        llm_model=row.llm_model,
        viz_data=row.viz_steps,
    )


@router.delete("/history/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_history(history_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> None:
    await db.execute(delete(AlgorithmHistory).where(AlgorithmHistory.id == history_id, AlgorithmHistory.user_id == user.id))
    await db.commit()
