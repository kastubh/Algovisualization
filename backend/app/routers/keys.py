from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.api_key import UserApiKey
from app.models.user import User
from app.schemas.keys import ApiKeyRead, ApiKeyUpsert
from app.services.encryption_service import encrypt_key

router = APIRouter(prefix="/keys", tags=["keys"])


@router.post("", response_model=ApiKeyRead)
async def save_key(payload: ApiKeyUpsert, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> ApiKeyRead:
    provider = payload.provider.lower()
    key_hint = f"...{payload.api_key[-4:]}"
    saved = await db.scalar(select(UserApiKey).where(UserApiKey.user_id == user.id, UserApiKey.provider == provider))
    if saved is None:
        saved = UserApiKey(user_id=user.id, provider=provider)
        db.add(saved)
    saved.encrypted_key = encrypt_key(payload.api_key)
    saved.key_hint = key_hint
    await db.commit()
    return ApiKeyRead(provider=provider, key_hint=key_hint)


@router.get("", response_model=list[ApiKeyRead])
async def list_keys(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> list[ApiKeyRead]:
    rows = (await db.scalars(select(UserApiKey).where(UserApiKey.user_id == user.id).order_by(UserApiKey.provider))).all()
    return [ApiKeyRead(provider=row.provider, key_hint=row.key_hint) for row in rows]


@router.delete("/{provider}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_key(provider: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> Response:
    saved = await db.scalar(select(UserApiKey).where(UserApiKey.user_id == user.id, UserApiKey.provider == provider.lower()))
    if saved:
        await db.delete(saved)
        await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
