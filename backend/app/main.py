from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.postgres import Base, engine

# Import all models before create_all()
from app.models.user import User
from app.models.palm_image import PalmImage
from app.models.palm_analysis import PalmAnalysis

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router
from app.api.v1.users import router as users_router
from app.api.v1.palm import router as palm_router


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Create Database Tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# Register Routers
# ============================================================

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(users_router)
app.include_router(palm_router)


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def home():
    return {
        "message": settings.APP_NAME,
        "version": settings.API_VERSION
    }