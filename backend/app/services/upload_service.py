import os
import uuid
import shutil

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.palm_image import PalmImage


class UploadService:

    UPLOAD_DIR = "uploads"

    @staticmethod
    def save_image(file: UploadFile) -> str:
        os.makedirs(UploadService.UPLOAD_DIR, exist_ok=True)

        extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{extension}"

        filepath = os.path.join(
            UploadService.UPLOAD_DIR,
            filename
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return filepath

    @staticmethod
    def upload_palm_image(
        db: Session,
        user_id: int,
        file: UploadFile
    ):

        filepath = UploadService.save_image(file)

        image = PalmImage(
            user_id=user_id,
            image_name=file.filename,
            image_path=filepath,
            image_size=os.path.getsize(filepath),
            image_format=os.path.splitext(file.filename)[1].replace(".", "").upper(),
            status="UPLOADED",
            analysis_status="PENDING"
        )

        db.add(image)
        db.commit()
        db.refresh(image)

        return image

    @staticmethod
    def get_user_images(
        db: Session,
        user_id: int
    ):

        return (
            db.query(PalmImage)
            .filter(PalmImage.user_id == user_id)
            .order_by(PalmImage.uploaded_at.desc())
            .all()
        )

    @staticmethod
    def get_image(
        db: Session,
        image_id: int
    ):

        image = (
            db.query(PalmImage)
            .filter(PalmImage.id == image_id)
            .first()
        )

        if image is None:
            raise HTTPException(
                status_code=404,
                detail="Image not found."
            )

        return image

    @staticmethod
    def delete_image(
        db: Session,
        image_id: int
    ):

        image = UploadService.get_image(
            db=db,
            image_id=image_id
        )

        if os.path.exists(image.image_path):
            os.remove(image.image_path)

        db.delete(image)
        db.commit()

        return {
            "message": "Image deleted successfully."
        }