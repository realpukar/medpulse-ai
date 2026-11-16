from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ReadmissionPredictionRequest(BaseModel):
    patient_id: Optional[int] = None
    age_group: str = Field(default="60-70", description="0-20, 20-40, 40-50, 50-60, 60-70, 70-80, 80-90, 90+")
    gender: str = Field(default="Female", description="Male, Female, Other")
    admission_type: str = Field(default="Emergency", description="Emergency, Urgent, Elective, Trauma")
    time_in_hospital: int = Field(default=4, ge=1, le=14, description="Days in hospital (1-14)")
    num_lab_procedures: int = Field(default=45, ge=1, le=120)
    num_procedures: int = Field(default=1, ge=0, le=6)
    num_medications: int = Field(default=15, ge=1, le=45)
    number_outpatient: int = Field(default=0, ge=0, le=15)
    number_emergency: int = Field(default=1, ge=0, le=15)
    number_inpatient: int = Field(default=1, ge=0, le=12)
    primary_diagnosis: str = Field(default="Circulatory", description="Circulatory, Respiratory, Endocrine, Digestive, Injury, Musculoskeletal, Other")
    comorbidity_score: int = Field(default=2, ge=0, le=8, description="Charlson Comorbidity Index (0-8)")
    glucose_test: str = Field(default="None", description="None, Normal, High")
    a1c_test: str = Field(default="High", description="None, Normal, High")
    diabetes_med: int = Field(default=1, ge=0, le=1)
    medication_change: int = Field(default=1, ge=0, le=1)

class ContributingFactor(BaseModel):
    factor: str
    impact: str # "INCREASES_RISK", "DECREASES_RISK", "NEUTRAL"
    description: str

class ReadmissionPredictionResponse(BaseModel):
    readmission_probability: float # 0.0 - 1.0 (e.g. 0.742)
    readmission_percentage: float # 74.2%
    risk_level: str # "Low Risk", "Moderate Risk", "High Risk"
    risk_color: str # hex code for UI
    model_used: str
    model_roc_auc: float
    confidence_interval: str
    contributing_factors: List[ContributingFactor]
    clinical_recommendations: List[str]
    disclaimer: str

class ModelBenchmarkResponse(BaseModel):
    models: Dict[str, Any]
    best_model: str
    target_outcome: str
    dataset_records: int
    top_feature_importances: List[Dict[str, Any]]
