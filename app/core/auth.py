from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.schemas.user_schema import UserResponse

# ---------------- SECURITY SETUP ----------------

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# HTTP Bearer scheme (Swagger will show token box)
security = HTTPBearer()

# ---------------- PASSWORD UTILS ----------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ---------------- TOKEN UTILS ----------------

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    payload = {
        "sub": data["sub"],
        "id": data.get("id"),
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "role": data.get("role"),
        "exp": expire,
    }

    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(
    data: dict,
    expires_delta: timedelta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
) -> str:
    expire = datetime.utcnow() + expires_delta
    payload = data.copy()
    payload.update({"exp": expire})

    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


# ---------------- AUTH DEPENDENCY ----------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserResponse:
    """
    Reads token from:
    Authorization: Bearer <token>
    """

    token = credentials.credentials

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])

        return UserResponse(
            id=payload["id"],
            name=payload["name"],
            email=payload["email"],
            phone=payload.get("phone"),
            role=payload["role"],
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# ---------------- ROLE-BASED DEPENDENCY ----------------

def require_role(required_role: str):
    def role_checker(
        current_user: UserResponse = Depends(get_current_user),
    ):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this resource",
            )
        return current_user

    return role_checker
