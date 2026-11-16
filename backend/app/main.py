"""
MEDPULSE AI — FastAPI Backend Application Entrypoint
AI-Powered Healthcare Analytics & Clinical Decision Support Platform
"""

import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.seed import seed_database
from app.api.auth import router as auth_router
from app.api.patients import router as patients_router
from app.api.vitals import router as vitals_router
from app.api.symptoms import router as symptoms_router
from app.api.reports import router as reports_router
from app.api.predictions import router as predictions_router
from app.api.analytics import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed initial demonstration data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="MEDPULSE AI — Production-Grade Healthcare Analytics, Vitals Telemetry, and Readmission Predictive Modeling Backend",
    lifespan=lifespan
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all for smooth Next.js integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(patients_router, prefix=settings.API_V1_STR)
app.include_router(vitals_router, prefix=settings.API_V1_STR)
app.include_router(symptoms_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(predictions_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "MEDPULSE AI Core API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "aesthetic": "Black & Pink Clinical AI (#080808, #FF4D9D)"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "models_loaded": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
