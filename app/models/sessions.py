import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.models import Base


class SessionStatus(str, enum.Enum):
    requested = "requested"
    approved = "approved"
    rejected = "rejected"
    completed = "completed"


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    coach_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    coachee_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    topic = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    capacity = Column(Integer, nullable=False)
    time = Column(DateTime, nullable=False)

    status = Column(
        Enum(SessionStatus, name="session_status_enum"),  # ✅ FIX
        default=SessionStatus.requested,
        nullable=False
    )

    coach = relationship(
        "User",
        foreign_keys=[coach_id]
    )
    coachee = relationship(
        "User",
        foreign_keys=[coachee_id]
    )
