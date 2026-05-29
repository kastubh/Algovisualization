import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SharedViz(Base):
    __tablename__ = "shared_viz"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    history_id: Mapped[str] = mapped_column(String(36), ForeignKey("algorithm_history.id", ondelete="CASCADE"), unique=True, nullable=False)
    share_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    history = relationship("AlgorithmHistory", back_populates="share")
