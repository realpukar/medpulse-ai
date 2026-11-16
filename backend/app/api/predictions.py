"""
MEDPULSE AI — Hospital Readmission Predictive Modeling Endpoints
Serves live machine learning predictions and benchmark performance comparisons.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_optional_current_user
from app.models.user import User
from app.models.prediction import PredictionRecord
from app.services.ml_service import ml_service
from app.schemas.prediction import (
    ReadmissionPredictionRequest,
    ReadmissionPredictionResponse,
    ModelBenchmarkResponse
)

router = APIRouter(prefix="/predictions", tags=["ML Predictive Modeling"])

@router.post("/readmission", response_model=ReadmissionPredictionResponse)
def predict_readmission_risk(
    req: ReadmissionPredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    result = ml_service.predict_readmission(req)

    # Log prediction to database
    record = PredictionRecord(
        patient_id=req.patient_id,
        user_id=current_user.id if current_user else None,
        model_name=result.model_used,
        readmission_probability=result.readmission_probability,
        risk_level=result.risk_level,
        input_features=req.model_dump(),
        key_factors=[f.model_dump() for f in result.contributing_factors]
    )
    db.add(record)
    db.commit()

    return result

@router.get("/benchmarks", response_model=ModelBenchmarkResponse)
def get_ml_benchmarks():
    return ml_service.get_benchmarks()
