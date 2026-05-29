from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.api_key import UserApiKey
from app.models.user import User
from app.schemas.tutor import TutorScriptRequest, TutorScriptResponse
from app.services.encryption_service import decrypt_key
from app.services.llm_service import LLMServiceError
from app.services.tutor_service import TutorService

router = APIRouter(prefix="/visualizations", tags=["tutor"])


@router.post("/{visualization_id}/tutor-script", response_model=TutorScriptResponse)
async def generate_tutor_script(
    visualization_id: str,
    request: TutorScriptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TutorScriptResponse:
    api_key = request.api_key
    provider = request.provider.lower()
    if not api_key:
        saved_key = await db.scalar(select(UserApiKey).where(UserApiKey.user_id == current_user.id, UserApiKey.provider == provider))
        if saved_key is None:
            raise HTTPException(status_code=402, detail=f"No API key found for provider '{provider}'. Please add one.")
        api_key = decrypt_key(saved_key.encrypted_key)

    try:
        return await TutorService(db).generate_tutor_script(
            visualization_id=visualization_id,
            user_id=current_user.id,
            provider=provider,
            model=request.model,
            api_key=api_key,
            voice_style=request.voice_style,
        )
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
