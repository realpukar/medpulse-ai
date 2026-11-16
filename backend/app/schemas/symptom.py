from typing import List, Optional
from pydantic import BaseModel, Field

class SymptomItem(BaseModel):
    id: str
    name: str
    category: str

class SymptomAnalysisRequest(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: str = Field(..., description="Male, Female, or Other")
    symptoms: List[str] = Field(..., min_length=1, description="List of symptom IDs or names")
    severity: int = Field(..., ge=1, le=10, description="Patient-rated severity scale 1-10")
    duration_days: int = Field(..., ge=1, le=365, description="Duration in days")
    pre_existing_conditions: Optional[List[str]] = []
    current_medications: Optional[str] = None

class PossibleCondition(BaseModel):
    name: str
    probability_band: str # Low, Moderate, Elevated (NOT definitive)
    description: str
    common_triggers: List[str]
    critical_flags: List[str]

class SymptomAnalysisResponse(BaseModel):
    urgency_level: str # EMERGENCY_IMMEDIATE, URGENT_EVALUATION, SEMI_URGENT, ROUTINE_CARE, SELF_MANAGEMENT
    urgency_title: str
    urgency_color: str # hex code for UI badge
    urgency_description: str
    clinical_acuity_score: float # 0 - 100
    matched_conditions: List[PossibleCondition]
    red_flags_present: List[str]
    recommended_actions: List[str]
    disclaimer: str
