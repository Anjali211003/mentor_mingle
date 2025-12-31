import enum
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.models import Base


# Enum for availability
class AvailabilityEnum(str, enum.Enum):
    available = "available"
    unavailable = "unavailable"


class CoacheeProfile(Base):
    __tablename__ = "coachee_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    bio = Column(Text, nullable=True)
    expertise = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)

    availability = Column(
        Enum(AvailabilityEnum, name="availability_enum"),  # ✅ FIX
        default=AvailabilityEnum.available,
        nullable=False
    )

    image_url = Column(String(255), nullable=True)

    # Relationship with User model
    user = relationship(
        "User",
        back_populates="coachee_profile"
    )
