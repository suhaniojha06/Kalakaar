from datetime import datetime

from pydantic import BaseModel, Field


class Credentials(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=4, max_length=128)


class ProfileOut(BaseModel):
    id: int
    name: str
    location: str
    cluster: str
    avatar_url: str
    verified: bool
    is_default: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    token: str
    profile: ProfileOut


class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = ""
    category: str = ""
    status: str = "draft"
    image_url: str = ""
    price: float = 0


class PostUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = None
    category: str | None = None
    status: str | None = None
    image_url: str | None = None
    price: float | None = None


class PostOut(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    category: str
    status: str
    image_url: str
    price: float
    created_at: datetime

    model_config = {"from_attributes": True}
