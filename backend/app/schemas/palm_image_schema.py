from pydantic import BaseModel
from datetime import datetime


class PalmImageUploadResponse(BaseModel):
    id: int
    image_name: str
    image_path: str
    image_size: int
    image_format: str
    status: str
    analysis_status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class PalmImageDetails(BaseModel):
    id: int
    user_id: int
    image_name: str
    image_path: str
    image_size: int
    image_format: str
    status: str
    analysis_status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True