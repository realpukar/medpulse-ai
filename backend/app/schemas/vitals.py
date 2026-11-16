from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class VitalsBase(BaseModel):
    patient_id: int
    heart_rate: float = Field(..., ge=20, le=250, description="Beats per minute")
    systolic_bp: float = Field(..., ge=50, le=260, description="Systolic mmHg")
    diastolic_bp: float = Field(..., ge=30, le=160, description="Diastolic mmHg")
    temperature: float = Field(..., ge=32.0, le=44.0, description="Body temperature in Celsius")
    spo2: float = Field(..., ge=50.0, le=100.0, description="Oxygen Saturation %")
    respiratory_rate: float = Field(..., ge=5, le=60, description="Breaths per minute")

class VitalsCreate(VitalsBase):
    timestamp: Optional[datetime] = None

class VitalsResponse(VitalsBase):
    id: int
    timestamp: datetime
    is_abnormal: bool
    anomaly_notes: Optional[str] = None

    class Config:
        from_attributes = True

class VitalsTelemetryOverview(BaseModel):
    patient_id: int
    patient_name: str
    latest: Optional[VitalsResponse] = None
    historical: List[VitalsResponse] = []
    total_records: int
    abnormal_count: int
