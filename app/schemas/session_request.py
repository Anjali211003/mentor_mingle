from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SessionRequestCreate(BaseModel):
    coach_id: int
    topic: str
    preferred_time: datetime
    message: Optional[str] = None


class SessionRequestResponse(BaseModel):
    id: int
    coach_id: int
    coachee_id: int
    topic: str
    location:Optional[str]=None
    capacity:Optional[int]=None
    preferred_time: datetime
    message: Optional[str]
    status: str

    class Config:
        from_attributes = True
