from datetime import datetime

from pydantic import BaseModel


class PalmAnalysisResponse(BaseModel):
    id: int
    user_id: int
    image_path: str
    hand: str
    features: dict
    classified_lines: dict
    interpretation: dict
    created_at: datetime

    class Config:
        from_attributes = True


class PalmHistoryResponse(BaseModel):
    id: int
    hand: str
    created_at: datetime

    class Config:
        from_attributes = True