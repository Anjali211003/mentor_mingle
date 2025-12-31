
from sqlalchemy.orm import Session
from app.models.coachee_profile import CoacheeProfile

class CoacheeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_coachee_profile(self, user_id: int):
        coachee = CoacheeProfile(user_id=user_id)
        self.db.add(coachee)
        self.db.commit()
        self.db.refresh(coachee)
        return coachee

    def get_by_user_id(self, user_id: int):
        return self.db.query(CoacheeProfile).filter(
            CoacheeProfile.user_id == user_id
        ).first()
