"""
MEDPULSE AI — Database Seed Utility
Seeds demonstration clinicians, inpatient clinical profiles, historical vitals telemetry,
and sample diagnostic reports on first startup.
"""

from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.patient import Patient
from app.models.vitals import VitalsRecord
from app.models.report import MedicalReport
from app.models.prediction import PredictionRecord
from app.core.security import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("[DB Seed] Seeding demonstration users...")
    clinician = User(
        email="clinician@medpulse.ai",
        hashed_password=get_password_hash("Medpulse@2026"),
        full_name="Dr. Alistair Sharma, MD",
        role="clinician",
        is_active=True
    )
    patient_user = User(
        email="patient@medpulse.ai",
        hashed_password=get_password_hash("Medpulse@2026"),
        full_name="Eleanor Ross",
        role="patient",
        is_active=True
    )
    db.add_all([clinician, patient_user])
    db.commit()
    db.refresh(clinician)
    db.refresh(patient_user)

    print("[DB Seed] Seeding demonstration inpatient profiles...")
    patients_data = [
        {
            "mrn": "MP-90214",
            "first_name": "Eleanor",
            "last_name": "Ross",
            "age": 67,
            "gender": "Female",
            "blood_group": "A+",
            "primary_diagnosis": "Congestive Heart Failure (NYHA Class III)",
            "room_number": "Cardiac ICU-301",
            "attending_physician": "Dr. Alistair Sharma, MD",
            "risk_category": "High",
            "status": "Admitted"
        },
        {
            "mrn": "MP-90215",
            "first_name": "Marcus",
            "last_name": "Vance",
            "age": 58,
            "gender": "Male",
            "blood_group": "O+",
            "primary_diagnosis": "Type 2 Diabetes with Peripheral Neuropathy",
            "room_number": "Endo-204",
            "attending_physician": "Dr. Sarah Chen, MD",
            "risk_category": "Moderate",
            "status": "Admitted"
        },
        {
            "mrn": "MP-90216",
            "first_name": "David",
            "last_name": "Patel",
            "age": 72,
            "gender": "Male",
            "blood_group": "B+",
            "primary_diagnosis": "COPD Acute Exacerbation",
            "room_number": "Pulm-108",
            "attending_physician": "Dr. Alistair Sharma, MD",
            "risk_category": "High",
            "status": "Admitted"
        },
        {
            "mrn": "MP-90217",
            "first_name": "Sophia",
            "last_name": "Martinez",
            "age": 44,
            "gender": "Female",
            "blood_group": "AB+",
            "primary_diagnosis": "Acute Cholecystitis (Post-Laparoscopic)",
            "room_number": "Surg-402",
            "attending_physician": "Dr. James Wilson, FACS",
            "risk_category": "Low",
            "status": "Admitted"
        },
        {
            "mrn": "MP-90218",
            "first_name": "Robert",
            "last_name": "Sterling",
            "age": 81,
            "gender": "Male",
            "blood_group": "O-",
            "primary_diagnosis": "Acute Coronary Syndrome (NSTEMI)",
            "room_number": "Cardiac ICU-304",
            "attending_physician": "Dr. Alistair Sharma, MD",
            "risk_category": "Critical",
            "status": "Admitted"
        },
        {
            "mrn": "MP-90219",
            "first_name": "Clara",
            "last_name": "O'Connor",
            "age": 35,
            "gender": "Female",
            "blood_group": "A-",
            "primary_diagnosis": "Acute Pyelonephritis",
            "room_number": "Med-115",
            "attending_physician": "Dr. Sarah Chen, MD",
            "risk_category": "Moderate",
            "status": "Admitted"
        }
    ]

    patient_instances = []
    for p in patients_data:
        pi = Patient(**p)
        db.add(pi)
        patient_instances.append(pi)
    
    db.commit()
    for pi in patient_instances:
        db.refresh(pi)

    print("[DB Seed] Seeding historical telemetry vitals for each patient...")
    now = datetime.utcnow()
    for p in patient_instances:
        # Generate 12 historical vitals points over the past 24 hours (every 2 hours)
        base_hr = 78 if p.risk_category == "Low" else (96 if p.risk_category == "Moderate" else 112)
        base_sys = 122 if p.risk_category == "Low" else (142 if p.risk_category == "Moderate" else 165)
        base_dia = 76 if p.risk_category == "Low" else (88 if p.risk_category == "Moderate" else 98)
        base_temp = 36.8 if p.risk_category == "Low" else (37.6 if p.risk_category == "Moderate" else 38.6)
        base_spo2 = 98.0 if p.risk_category == "Low" else (95.0 if p.risk_category == "Moderate" else 91.0)
        base_rr = 16.0 if p.risk_category == "Low" else (20.0 if p.risk_category == "Moderate" else 26.0)

        for i in range(12):
            ts = now - timedelta(hours=(11 - i) * 2)
            hr = base_hr + random.uniform(-6, 6)
            sys_bp = base_sys + random.uniform(-8, 8)
            dia_bp = base_dia + random.uniform(-5, 5)
            temp = base_temp + random.uniform(-0.3, 0.3)
            spo2 = min(100.0, max(85.0, base_spo2 + random.uniform(-1.5, 1.5)))
            rr = base_rr + random.uniform(-2, 2)

            is_abnormal = False
            notes = []
            if hr > 100:
                is_abnormal = True
                notes.append("Tachycardia")
            elif hr < 60:
                is_abnormal = True
                notes.append("Bradycardia")

            if sys_bp >= 140 or dia_bp >= 90:
                is_abnormal = True
                notes.append("Hypertension")
            
            if spo2 < 93.0:
                is_abnormal = True
                notes.append("Hypoxemia")

            if temp >= 38.0:
                is_abnormal = True
                notes.append("Febrile (Fever)")

            vr = VitalsRecord(
                patient_id=p.id,
                timestamp=ts,
                heart_rate=round(hr, 1),
                systolic_bp=round(sys_bp, 1),
                diastolic_bp=round(dia_bp, 1),
                temperature=round(temp, 1),
                spo2=round(spo2, 1),
                respiratory_rate=round(rr, 1),
                is_abnormal=is_abnormal,
                anomaly_notes="; ".join(notes) if notes else None
            )
            db.add(vr)

    print("[DB Seed] Seeding sample predictions and medical reports...")
    # Add a sample prediction
    pred = PredictionRecord(
        patient_id=patient_instances[0].id,
        user_id=clinician.id,
        model_name="Gradient Boosting",
        readmission_probability=0.784,
        risk_level="High Risk",
        input_features={
            "age_group": "60-70",
            "primary_diagnosis": "Circulatory",
            "number_inpatient": 2,
            "number_emergency": 1,
            "comorbidity_score": 4,
            "time_in_hospital": 6
        },
        key_factors=[
            {"factor": "Prior Inpatient Admissions", "impact": "INCREASES_RISK", "description": "2 prior acute admissions"},
            {"factor": "Cardiovascular Primary Diagnosis", "impact": "INCREASES_RISK", "description": "High readmission risk"}
        ]
    )
    db.add(pred)

    # Add sample report
    rep = MedicalReport(
        patient_id=patient_instances[0].id,
        filename="Admission_Cardiopulmonary_Panel_ER.pdf",
        file_type="PDF",
        extracted_text="Admission laboratory panel for Eleanor Ross showing mild anemia (Hgb 10.4 g/dL) and elevated BNP.",
        structured_data=[
            {"name": "Hemoglobin (HGB)", "value": 10.4, "unit": "g/dL", "status": "LOW"},
            {"name": "White Blood Cell Count", "value": 14.8, "unit": "x10^3/uL", "status": "ELEVATED"}
        ],
        summary="Analysis shows marked leukocytosis and mild microcytic anemia in the setting of acute decompensated heart failure.",
        risk_level="Attention Required"
    )
    db.add(rep)

    db.commit()
    print("[DB Seed] Completed successfully.")
