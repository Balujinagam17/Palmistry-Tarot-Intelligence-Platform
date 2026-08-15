from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func

from app.database.postgres import Base


class PalmAnalysis(Base):
    __tablename__ = "palm_analysis"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    image_path = Column(String, nullable=False)

    hand = Column(String)

    features = Column(JSON)

    classified_lines = Column(JSON)

    interpretation = Column(JSON)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )