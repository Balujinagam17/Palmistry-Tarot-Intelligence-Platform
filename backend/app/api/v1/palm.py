from typing import List

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.database.postgres import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.palm_image_schema import (
    PalmImageUploadResponse,
    PalmImageDetails,
)

from app.services.upload_service import UploadService
from app.services.palm_analysis_service import PalmAnalysisService
from app.repositories.palm_analysis_repository import PalmAnalysisRepository


router = APIRouter(
    prefix="/api/v1/palm",
    tags=["Palm Analysis"]
)


# -----------------------------
# Upload Image
# -----------------------------
@router.post(
    "/upload",
    response_model=PalmImageUploadResponse
)
def upload_palm_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UploadService.upload_palm_image(
        db=db,
        user_id=current_user.id,
        file=file
    )


# -----------------------------
# Analyze Uploaded Image
# -----------------------------
@router.post("/analyze/{image_id}")
def analyze_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = UploadService.get_image(
        db=db,
        image_id=image_id
    )

    if image.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    service = PalmAnalysisService()

    try:
        result = service.analyze(
            image_path=image.image_path,
            db=db,
            user_id=current_user.id
        )

        if not result["success"]:
            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )

        return {
            "status": "success",
            "data": result
        }

    finally:
        service.close()


# -----------------------------
# Uploaded Images
# -----------------------------
@router.get(
    "/images",
    response_model=List[PalmImageDetails]
)
def get_uploaded_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UploadService.get_user_images(
        db=db,
        user_id=current_user.id
    )


# -----------------------------
# Get Uploaded Image
# -----------------------------
@router.get(
    "/images/{image_id}",
    response_model=PalmImageDetails
)
def get_uploaded_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = UploadService.get_image(
        db=db,
        image_id=image_id
    )

    if image.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    return image


# -----------------------------
# Delete Uploaded Image
# -----------------------------
@router.delete("/images/{image_id}")
def delete_uploaded_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = UploadService.get_image(
        db=db,
        image_id=image_id
    )

    if image.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    return UploadService.delete_image(
        db=db,
        image_id=image_id
    )


# -----------------------------
# Analysis History
# -----------------------------
@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = PalmAnalysisRepository.get_user_history(
        db=db,
        user_id=current_user.id
    )

    return {
        "status": "success",
        "count": len(history),
        "data": history
    }


# -----------------------------
# Get Analysis by ID
# -----------------------------
@router.get("/history/{analysis_id}")
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = PalmAnalysisRepository.get_by_id(
        db,
        analysis_id
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    return {
        "status": "success",
        "data": analysis
    }


# -----------------------------
# Delete Analysis
# -----------------------------
@router.delete("/history/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = PalmAnalysisRepository.get_by_id(
        db,
        analysis_id
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    PalmAnalysisRepository.delete(
        db,
        analysis_id
    )

    return {
        "status": "success",
        "message": "Analysis deleted successfully."
    }