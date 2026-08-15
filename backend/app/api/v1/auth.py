from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest
from app.database.postgres import get_db
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:
        user = AuthService.register(
            db,
            request
        )

        return {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    try:

        request = LoginRequest(
            email=form_data.username,
            password=form_data.password
        )

        return AuthService.login(
            db,
            request
        )

    except Exception as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )