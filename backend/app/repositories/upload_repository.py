from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.palm_image import PalmImage


class UploadRepository:

    @staticmethod
    def create(
        db: Session,
        palm_image: PalmImage
    ) -> PalmImage:

        db.add(palm_image)
        db.commit()
        db.refresh(palm_image)

        return palm_image

    @staticmethod
    def get_by_id(
        db: Session,
        image_id: int
    ) -> Optional[PalmImage]:

        return (
            db.query(PalmImage)
            .filter(PalmImage.id == image_id)
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int
    ) -> List[PalmImage]:

        return (
            db.query(PalmImage)
            .filter(PalmImage.user_id == user_id)
            .order_by(PalmImage.uploaded_at.desc())
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        image: PalmImage
    ) -> None:

        db.delete(image)
        db.commit()

    @staticmethod
    def update_status(
        db: Session,
        image: PalmImage,
        status: str,
        analysis_status: str
    ) -> PalmImage:

        image.status = status
        image.analysis_status = analysis_status

        db.commit()
        db.refresh(image)

        return image