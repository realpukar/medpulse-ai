from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class PatientBase(BaseModel):
    mrn: str
    first_name: str
    last_name: str
    age: int
    gender: str
    blood_group: Optional[str] = "O+"
    primary_diagnosis: str
    room_number: Optional[str] = "ICU-102"
    attending_physician: Optional[str] = "Dr. A. Sharma, MD"
    risk_category: Optional[str] = "Moderate"
    status: Optional[str] = "Admitted"

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    primary_diagnosis: Optional[str] = None
    room_number: Optional[str] = None
    attending_physician: Optional[str] = None
    risk_category: Optional[str] = None
    status: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    admission_date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
