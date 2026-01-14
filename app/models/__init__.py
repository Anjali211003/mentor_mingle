# Import models here
from sqlalchemy.ext.declarative import declarative_base

# You can import other models in the same way

Base = declarative_base()
from app.models.users import User
from app.models.sessions import Session
from app.models.coach_profile import CoachProfile
from app.models.coachee_profile import CoacheeProfile
from app.models.SessionRequest import SessionRequest
