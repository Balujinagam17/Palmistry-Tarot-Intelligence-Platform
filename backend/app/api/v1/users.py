from fastapi import APIRouter, Depends

from app.dependencies.role import require_role
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.get("/admin")
def admin_dashboard(
    current_user: User = Depends(require_role("ADMIN"))
):

    return {
        "message": "Welcome Admin",
        "user": current_user.full_name
    }