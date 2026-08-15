from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.repositories.user_repository import UserRepository
from app.utils.jwt import verify_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    email = payload.get("sub")

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = UserRepository.get_by_email(
        db,
        email
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User Not Found"
        )

    return user