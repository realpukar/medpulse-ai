"""
Vitals Record Model — Telemetry, Hemodynamics, and Anomaly Tracking
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class VitalsRecord(Base):
    __tablename__ = "vitals_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    heart_rate = Column(Float, nullable=False) # bpm
    systolic_bp = Column(Float, nullable=False) # mmHg
    diastolic_bp = Column(Float, nullable=False) # mmHg
    temperature = Column(Float, nullable=False) # Celsius
    spo2 = Column(Float, nullable=False) # %
    respiratory_rate = Column(Float, nullable=False) # breaths/min

    is_abnormal = Column(Boolean, default=False)
    anomaly_notes = Column(Text, nullable=True) # e.g. "Tachycardia; Stage 2 Hypertension"

    # Relationships
    patient = relationship("Patient", back_populates="vitals")
