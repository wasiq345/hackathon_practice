import os
from datetime import datetime, timedelta, timezone
from uuid import UUID

import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, status
from psycopg.errors import UniqueViolation

from backend.db import get_connection
from backend.auth.schemas import (
    LoginRequest,
    LoginResponse,
    LoginUserResponse,
    RegisterRequest,
    UserResponse,
)


router = APIRouter(prefix="/api/auth", tags=["authentication"])
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60
INVALID_CREDENTIALS = "Invalid email or password."
DUMMY_PASSWORD_HASH = bcrypt.hashpw(
    b"invalid-login-password", bcrypt.gensalt()
).decode("utf-8")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def create_access_token(user_id: UUID, role: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expires_at}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: RegisterRequest):
    email = normalize_email(request.email)
    password_hash = bcrypt.hashpw(
        request.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    try:
        with get_connection() as connection:
            user = connection.execute(
                """
                INSERT INTO users (full_name, email, password_hash, role)
                VALUES (%s, %s, %s, 'student')
                RETURNING id, full_name AS name, email, role, created_at
                """,
                (request.name.strip(), email, password_hash),
            ).fetchone()
    except UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from None

    return dict(user)


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    email = normalize_email(request.email)

    with get_connection() as connection:
        user = connection.execute(
            """
            SELECT id, full_name AS name, email, password_hash, role
            FROM users
            WHERE email = %s
            """,
            (email,),
        ).fetchone()

    password_hash = user["password_hash"] if user else DUMMY_PASSWORD_HASH
    password_matches = bcrypt.checkpw(
        request.password.encode("utf-8"), password_hash.encode("utf-8")
    )
    if not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS,
        )

    return {
        "access_token": create_access_token(user["id"], str(user["role"])),
        "token_type": "bearer",
        "user": LoginUserResponse.model_validate(user),
    }