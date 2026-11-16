"""
Tests for Patients and Vitals Telemetry
"""

def test_list_patients(client):
    response = client.get("/api/patients")
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 6
    assert any(p["first_name"] == "Eleanor" for p in patients)

def test_record_abnormal_vitals_triggers_alert(client):
    # Patient 1 exists from seed
    vitals_payload = {
        "patient_id": 1,
        "heart_rate": 128.0, # Tachycardia
        "systolic_bp": 172.0, # Stage 2 Hypertension
        "diastolic_bp": 104.0,
        "temperature": 39.2, # High Fever
        "spo2": 89.5, # Severe Hypoxemia
        "respiratory_rate": 28.0 # Tachypnea
    }
    response = client.post("/api/vitals", json=vitals_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["is_abnormal"] is True
    assert "Tachycardia" in data["anomaly_notes"]
    assert "Severe Hypoxemia" in data["anomaly_notes"]

def test_get_patient_telemetry(client):
    response = client.get("/api/vitals/patient/1")
    assert response.status_code == 200
    data = response.json()
    assert data["patient_name"] == "Eleanor Ross"
    assert len(data["historical"]) > 0
