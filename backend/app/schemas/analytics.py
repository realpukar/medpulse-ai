from typing import List, Dict, Any
from pydantic import BaseModel

class KeyMetricCard(BaseModel):
    title: str
    value: str
    change: str
    trend: str # "up", "down", "neutral"
    is_positive: bool
    description: str

class DemographicDistribution(BaseModel):
    age_group: str
    count: int
    readmitted_count: int
    readmission_rate_pct: float

class DiagnosisDistribution(BaseModel):
    diagnosis: str
    patient_count: int
    high_risk_pct: float

class RiskBreakdown(BaseModel):
    category: str
    percentage: float
    patient_count: int
    color: str

class VitalsAverages(BaseModel):
    avg_heart_rate: float
    avg_systolic_bp: float
    avg_diastolic_bp: float
    avg_temperature: float
    avg_spo2: float
    abnormal_vitals_count: int

class AnalyticsOverviewResponse(BaseModel):
    total_patients: int
    admitted_patients: int
    readmission_benchmark_rate: float
    high_risk_patients: int
    key_metrics: List[KeyMetricCard]
    age_distribution: List[DemographicDistribution]
    diagnosis_distribution: List[DiagnosisDistribution]
    risk_breakdown: List[RiskBreakdown]
    vitals_averages: VitalsAverages
    recent_trend_dates: List[str]
    recent_trend_readmissions: List[int]
