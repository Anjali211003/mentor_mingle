
from sqlalchemy.orm import Session
from app.models.coach_profile import CoachProfile

class CoachRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_coach_profile(self, user_id: int):
        coach = CoachProfile(user_id=user_id)
        self.db.add(coach)
        self.db.commit()
        self.db.refresh(coach)
        return coach

    def get_by_user_id(self, user_id: int):
        return self.db.query(CoachProfile).filter(
            CoachProfile.user_id == user_id
        ).first()
