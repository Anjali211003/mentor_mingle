from datetime import datetime
import enum
from sqlalchemy import Column, DateTime, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.models import Base
class SessionRequest(Base):
    __tablename__ = "session_requests"

    id = Column(Integer, primary_key=True, index=True)
    coachee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(String, nullable=False)
    preferred_time = Column(DateTime, nullable=False)
    message = Column(String, nullable=True)

    status = Column(String, default="pending")  # pending | approved | rejected
    created_at = Column(DateTime, default=datetime.utcnow)
