from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token


class AuthService:

    @staticmethod
    def register(db: Session, request: RegisterRequest):

        existing = UserRepository.get_by_email(db, request.email)

        if existing:
            raise Exception("Email already exists")

        user = User(
            full_name=request.full_name,
            email=request.email,
            password=hash_password(request.password),
            role="USER"
        )

        return UserRepository.create(db, user)

    @staticmethod
    def login(db: Session, request: LoginRequest):

        user = UserRepository.get_by_email(db, request.email)

        if not user:
            raise Exception("Invalid email or password")

        if not verify_password(request.password, user.password):
            raise Exception("Invalid email or password")

        token = create_access_token(
            {
                "sub": user.email,
                "role": user.role,
                "user_id": user.id
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }