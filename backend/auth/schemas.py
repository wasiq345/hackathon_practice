from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    created_at: datetime


class LoginUserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginUserResponse