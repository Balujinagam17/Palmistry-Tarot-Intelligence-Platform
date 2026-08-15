from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.postgres import Base


class PalmImage(Base):

    __tablename__ = "palm_images"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    image_name = Column(
        String(255),
        nullable=False
    )

    image_path = Column(
        String(500),
        nullable=False,
        unique=True
    )

    image_size = Column(
        Integer,
        nullable=False
    )

    image_format = Column(
        String(20),
        nullable=False
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    status = Column(
        String(30),
        default="UPLOADED"
    )

    analysis_status = Column(
        String(30),
        default="PENDING"
    )

    user = relationship(
        "User",
        backref="palm_images"
    )