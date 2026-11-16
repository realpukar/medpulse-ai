"""
MEDPULSE AI — AI Symptom Analysis Endpoints
Triage and clinical acuity decision-support.
"""

from typing import List, Dict, Any
from fastapi import APIRouter
from app.services.symptom_engine import symptom_engine
from app.schemas.symptom import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse
)

router = APIRouter(prefix="/symptoms", tags=["Symptom Analyzer"])

@router.get("/list", response_model=List[Dict[str, Any]])
def list_available_symptoms():
    return symptom_engine.get_all_symptoms()

@router.post("/analyze", response_model=SymptomAnalysisResponse)
def analyze_symptoms(request: SymptomAnalysisRequest):
    return symptom_engine.analyze(request)
