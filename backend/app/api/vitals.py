"""
MEDPULSE AI — Vitals Telemetry & Clinical Hemodynamics
Manual and simulated patient vitals recording, abnormal threshold detection,
and historical trend analysis.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.patient import Patient
from app.models.vitals import VitalsRecord
from app.schemas.vitals import VitalsCreate, VitalsResponse, VitalsTelemetryOverview

router = APIRouter(prefix="/vitals", tags=["Vitals"])

def evaluate_vitals_anomalies(v: VitalsCreate) -> tuple[bool, Optional[str]]:
    flags = []
    # Heart Rate: normal 60-100 bpm
    if v.heart_rate > 100:
        flags.append("Tachycardia (>100 bpm)")
    elif v.heart_rate < 60:
        flags.append("Bradycardia (<60 bpm)")

    # Blood Pressure: normal Sys < 120, Dia < 80; Stage 2 Sys >= 140 or Dia >= 90; Hypertensive Crisis Sys > 180 or Dia > 120
    if v.systolic_bp >= 180 or v.diastolic_bp >= 120:
        flags.append("Hypertensive Crisis Emergency (>=180/>=120 mmHg)")
    elif v.systolic_bp >= 140 or v.diastolic_bp >= 90:
        flags.append("Stage 2 Hypertension (>=140/>=90 mmHg)")
    elif v.systolic_bp < 90 or v.diastolic_bp < 60:
        flags.append("Hypotension (<90/<60 mmHg)")

    # Temperature: normal 36.1 - 37.2 C; Febrile >= 38.0 C
    if v.temperature >= 38.0:
        flags.append(f"Febrile / Fever ({v.temperature:.1f}°C)")
    elif v.temperature < 35.5:
        flags.append(f"Hypothermia ({v.temperature:.1f}°C)")

    # Oxygen Saturation (SpO2): normal 95-100%; Mild hypoxemia 91-94%; Severe < 90%
    if v.spo2 < 90.0:
        flags.append(f"Severe Hypoxemia ({v.spo2:.1f}%)")
    elif v.spo2 < 94.0:
        flags.append(f"Mild Hypoxemia ({v.spo2:.1f}%)")

    # Respiratory Rate: normal 12-20 breaths/min
    if v.respiratory_rate > 24:
        flags.append(f"Tachypnea ({v.respiratory_rate:.0f} breaths/min)")
    elif v.respiratory_rate < 10:
        flags.append(f"Bradypnea ({v.respiratory_rate:.0f} breaths/min)")

    is_abnormal = len(flags) > 0
    return is_abnormal, "; ".join(flags) if flags else None

@router.post("", response_model=VitalsResponse, status_code=status.HTTP_201_CREATED)
def record_vitals(vitals_in: VitalsCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == vitals_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    is_abnormal, anomaly_notes = evaluate_vitals_anomalies(vitals_in)

    record = VitalsRecord(
        patient_id=vitals_in.patient_id,
        timestamp=vitals_in.timestamp or datetime.utcnow(),
        heart_rate=vitals_in.heart_rate,
        systolic_bp=vitals_in.systolic_bp,
        diastolic_bp=vitals_in.diastolic_bp,
        temperature=vitals_in.temperature,
        spo2=vitals_in.spo2,
        respiratory_rate=vitals_in.respiratory_rate,
        is_abnormal=is_abnormal,
        anomaly_notes=anomaly_notes
    )
    db.add(record)

    # Adjust patient risk category if abnormal flags severe
    if is_abnormal and ("Severe Hypoxemia" in anomaly_notes or "Hypertensive Crisis" in anomaly_notes):
        patient.risk_category = "Critical"
    elif is_abnormal and patient.risk_category == "Low":
        patient.risk_category = "Moderate"

    db.commit()
    db.refresh(record)
    return record

@router.get("/patient/{patient_id}", response_model=VitalsTelemetryOverview)
def get_patient_telemetry(
    patient_id: int,
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    records = db.query(VitalsRecord)\
        .filter(VitalsRecord.patient_id == patient_id)\
        .order_by(VitalsRecord.timestamp.asc())\
        .all()

    historical = [VitalsResponse.model_validate(r) for r in records[-limit:]]
    latest = VitalsResponse.model_validate(records[-1]) if records else None
    abnormal_count = sum(1 for r in records if r.is_abnormal)

    return VitalsTelemetryOverview(
        patient_id=patient.id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        latest=latest,
        historical=historical,
        total_records=len(records),
        abnormal_count=abnormal_count
    )

@router.get("/alerts", response_model=List[VitalsResponse])
def get_recent_abnormal_alerts(
    limit: int = Query(15, ge=1, le=50),
    db: Session = Depends(get_db)
):
    return db.query(VitalsRecord)\
        .filter(VitalsRecord.is_abnormal == True)\
        .order_by(VitalsRecord.timestamp.desc())\
        .limit(limit)\
        .all()
