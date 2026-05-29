import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.algorithm_history import AlgorithmHistory
from app.models.shared_viz import SharedViz
from app.models.user import User
from app.schemas.algorithm import HistoryDetail, ShareResponse

router = APIRouter(prefix="/share", tags=["share"])


@router.post("/{history_id}", response_model=ShareResponse)
async def create_share(history_id: str, request: Request, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> ShareResponse:
    history = await db.scalar(select(AlgorithmHistory).where(AlgorithmHistory.id == history_id, AlgorithmHistory.user_id == user.id))
    if history is None:
        raise HTTPException(status_code=404, detail="Visualization not found")
    share = await db.scalar(select(SharedViz).where(SharedViz.history_id == history_id))
    if share is None:
        share = SharedViz(history_id=history_id, share_token=secrets.token_urlsafe(24))
        history.is_public = True
        db.add(share)
        await db.commit()
        await db.refresh(share)
    frontend_origin = str(request.app.state.frontend_url).rstrip("/")
    return ShareResponse(share_token=share.share_token, url=f"{frontend_origin}/shared/{share.share_token}")


@router.get("/{token}", response_model=HistoryDetail)
async def get_shared(token: str, db: AsyncSession = Depends(get_db)) -> HistoryDetail:
    share = await db.scalar(select(SharedViz).where(SharedViz.share_token == token))
    if share is None:
        raise HTTPException(status_code=404, detail="Shared visualization not found")
    history = await db.scalar(select(AlgorithmHistory).where(AlgorithmHistory.id == share.history_id))
    if history is None:
        raise HTTPException(status_code=404, detail="Shared visualization not found")
    share.view_count += 1
    await db.commit()
    return HistoryDetail(
        id=history.id,
        title=history.title,
        algorithm_type=history.algorithm_type,
        llm_provider=history.llm_provider,
        step_count=history.step_count,
        created_at=history.created_at,
        is_public=history.is_public,
        algorithm_text=history.algorithm_text,
        llm_model=history.llm_model,
        viz_data=history.viz_steps,
    )


@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_share(history_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> None:
    history = await db.scalar(select(AlgorithmHistory).where(AlgorithmHistory.id == history_id, AlgorithmHistory.user_id == user.id))
    if history is None:
        raise HTTPException(status_code=404, detail="Visualization not found")
    share = await db.scalar(select(SharedViz).where(SharedViz.history_id == history_id))
    if share:
        await db.delete(share)
    history.is_public = False
    await db.commit()
