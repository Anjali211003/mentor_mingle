from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.sessions import SessionLocal
from app.models.sessions import Session as SessionModel
from app.schemas.session_schema import SessionCreate, SessionUpdate, SessionResponse
from app.models.users import User
from app.core.auth import get_current_user
from app.models.SessionRequest import SessionRequest
from app.schemas.session_request import SessionRequestCreate,SessionRequestResponse
router = APIRouter()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the current authenticated user
def get_user_from_token(current_user: User = Depends(get_current_user)):
    return current_user

# Create Session
@router.post("/sessions", response_model=SessionResponse)
def create_session(
    session: SessionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_user_from_token)
):
    if current_user.role != "coach":
        raise HTTPException(status_code=403, detail="Only coaches can create sessions")
    
    new_session = SessionModel(
        coach_id=current_user.id,
        coachee_id=session.coachee_id,
        topic=session.topic,
        location=session.location,
        capacity=session.capacity,
        time=session.time,
        status=session.status
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session
@router.get("/sessions", response_model=list[SessionResponse])
def get_all_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Both coach & coachee can view sessions
    if current_user.role not in ["coach", "coachee"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view sessions"
        )

    sessions = db.query(SessionModel).all()
    return sessions

@router.put("/sessions/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: int,
    session: SessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_from_token)
):
    # Ensure only coaches can update sessions
    if current_user.role != "coach":
        raise HTTPException(status_code=403, detail="Only coaches can update sessions")

    existing_session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not existing_session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Update the session fields
    if session.topic:
        existing_session.topic = session.topic
    if session.location:
        existing_session.location = session.location
    if session.capacity:
        existing_session.capacity = session.capacity
    if session.time:
        existing_session.time = session.time
    if session.status:
        existing_session.status = session.status

    db.commit()
    db.refresh(existing_session)

    return existing_session
@router.get("/sessions/my", response_model=list[SessionResponse])
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "coach":
        raise HTTPException(
            status_code=403,
            detail="Only coaches can view their sessions"
        )

    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.coach_id == current_user.id)
        .all()
    )

    return sessions
@router.get("/sessions/requests/my", response_model=list[SessionResponse])
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "coachee":
        raise HTTPException(
            status_code=403,
            detail="Only coachees can view their sessions"
        )

    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.coachee_id == current_user.id)
        .all()
    )

    return sessions

@router.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Make sure the user is authorized to view the session
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session

@router.delete("/sessions/{session_id}", status_code=204)
def delete_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_user_from_token)):
    # Ensure the user is authorized to delete the session (e.g., only coach can delete)
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Ensure the current user is the coach of this session or authorized to delete it
    if current_user.role != "coach" or session.coach_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this session")

    db.delete(session)
    db.commit()

    return {"message": "Session deleted successfully"}
@router.post("/session-requests")
def create_session_request(
    request: SessionRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_from_token)
):
    if current_user.role != "coachee":
        raise HTTPException(403, "Only coachees can request sessions")

    new_request = SessionRequest(
        coachee_id=current_user.id,
        coach_id=request.coach_id,
        topic=request.topic,
        preferred_time=request.preferred_time,
        message=request.message
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request


@router.get("/session-requests/coach")
def get_requests_for_coach(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_from_token)
):
    if current_user.role != "coach":
        raise HTTPException(403, "Only coaches allowed")

    return db.query(SessionRequest)\
        .filter(SessionRequest.coach_id == current_user.id)\
        .all()

@router.post("/session-requests/{request_id}/approve")
def approve_request_and_create_session(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_from_token)
):
    if current_user.role != "coach":
        raise HTTPException(403)

    req = db.query(SessionRequest).filter_by(id=request_id).first()
    if not req:
        raise HTTPException(404)

    # create actual session
    session = SessionModel(
        coach_id=req.coach_id,
        coachee_id=req.coachee_id,
        topic=req.topic,
        time=req.preferred_time,
        status="approved"
    )

    req.status = "approved"

    db.add(session)
    db.commit()
    return session

@router.post("/session-requests/{request_id}/reject")
def approve_request_and_create_session(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_from_token)
):
    if current_user.role != "coach":
        raise HTTPException(403)

    req = db.query(SessionRequest).filter_by(id=request_id).first()
    if not req:
        raise HTTPException(404)

    # create actual session
    session = SessionModel(
        coach_id=req.coach_id,
        coachee_id=req.coachee_id,
        topic=req.topic,
        time=req.preferred_time,
        status="rejected"
    )

    req.status = "rejected"

    db.add(session)
    db.commit()
    return session
