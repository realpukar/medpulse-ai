"""
Medical Report Model — Uploaded Laboratory & Diagnostic Reports
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), default="PDF")
    upload_date = Column(DateTime, default=datetime.utcnow)

    extracted_text = Column(Text, nullable=True)
    structured_data = Column(JSON, nullable=True) # Extracted biomarkers & ranges
    summary = Column(Text, nullable=True) # Layman translation
    risk_level = Column(String(50), default="Normal") # Normal, Moderate, Attention Needed

    # Relationships
    patient = relationship("Patient", back_populates="reports")
