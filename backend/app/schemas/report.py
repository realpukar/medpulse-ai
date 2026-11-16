from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class BiomarkerResult(BaseModel):
    name: str
    category: str # e.g. "Complete Blood Count", "Metabolic Panel", "Lipids", "Vital Signs"
    value: float
    unit: str
    reference_range: str
    status: str # "NORMAL", "ELEVATED", "LOW", "CRITICAL"
    clinical_meaning: str

class MedicalTermDefinition(BaseModel):
    term: str
    plain_english: str
    context_note: str

class ReportAnalysisResponse(BaseModel):
    report_id: Optional[int] = None
    filename: str
    extracted_character_count: int
    biomarkers_detected: List[BiomarkerResult]
    medical_terms_translated: List[MedicalTermDefinition]
    layman_summary: str
    overall_health_risk: str # "Normal", "Moderate - Follow-up Recommended", "Attention Required"
    suggested_physician_questions: List[str]
    disclaimer: str

class TextReportAnalysisRequest(BaseModel):
    text: str
    patient_id: Optional[int] = None
    report_name: Optional[str] = "Clinical Lab Report"
