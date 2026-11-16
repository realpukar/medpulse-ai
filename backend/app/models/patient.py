"""
Patient Model — Clinical Profile & Inpatient Identity
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    mrn = Column(String(50), unique=True, index=True, nullable=False) # Medical Record Number
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False) # Male, Female, Other
    blood_group = Column(String(10), default="O+")
    primary_diagnosis = Column(String(255), nullable=False)
    admission_date = Column(DateTime, default=datetime.utcnow)
    room_number = Column(String(50), default="ICU-102")
    attending_physician = Column(String(255), default="Dr. A. Sharma, MD")
    risk_category = Column(String(50), default="Moderate") # Low, Moderate, High, Critical
    status = Column(String(50), default="Admitted") # Admitted, Discharged, Transferred
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    vitals = relationship("VitalsRecord", back_populates="patient", cascade="all, delete-orphan", order_by="VitalsRecord.timestamp.desc()")
    reports = relationship("MedicalReport", back_populates="patient", cascade="all, delete-orphan")
    predictions = relationship("PredictionRecord", back_populates="patient", cascade="all, delete-orphan")
