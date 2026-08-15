from sqlalchemy.orm import Session

from app.models.palm_analysis import PalmAnalysis


class PalmAnalysisRepository:

    @staticmethod
    def create(db: Session, data: dict):
        analysis = PalmAnalysis(**data)

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return analysis

    @staticmethod
    def get_by_id(db: Session, analysis_id: int):
        return (
            db.query(PalmAnalysis)
            .filter(PalmAnalysis.id == analysis_id)
            .first()
        )

    @staticmethod
    def get_user_history(db: Session, user_id: int):
        return (
            db.query(PalmAnalysis)
            .filter(PalmAnalysis.user_id == user_id)
            .order_by(PalmAnalysis.created_at.desc())
            .all()
        )

    @staticmethod
    def delete(db: Session, analysis_id: int):
        analysis = (
            db.query(PalmAnalysis)
            .filter(PalmAnalysis.id == analysis_id)
            .first()
        )

        if not analysis:
            return False

        db.delete(analysis)
        db.commit()

        return True