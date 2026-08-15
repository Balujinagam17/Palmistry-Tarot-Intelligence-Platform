from pydantic import BaseModel

from app.models.role import UserRole


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: str

    role: UserRole

    class Config:

        from_attributes = True