"""
Prediction Record Model — ML Inpatient Readmission Inference Logs
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    model_name = Column(String(100), default="Gradient Boosting")
    readmission_probability = Column(Float, nullable=False) # 0.0 - 1.0
    risk_level = Column(String(50), nullable=False) # Low, Moderate, High
    input_features = Column(JSON, nullable=False)
    key_factors = Column(JSON, nullable=True) # Top risk contributors

    # Relationships
    patient = relationship("Patient", back_populates="predictions")
    user = relationship("User", back_populates="predictions")
