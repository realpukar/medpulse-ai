"""
Tests for ML Readmission Prediction and Model Benchmarks
"""

def test_predict_readmission_high_risk(client):
    payload = {
        "age_group": "70-80",
        "gender": "Female",
        "admission_type": "Emergency",
        "time_in_hospital": 8,
        "num_lab_procedures": 65,
        "num_procedures": 2,
        "num_medications": 24,
        "number_outpatient": 1,
        "number_emergency": 3,
        "number_inpatient": 4, # High prior admissions
        "primary_diagnosis": "Circulatory",
        "comorbidity_score": 5, # High comorbidity
        "glucose_test": "High",
        "a1c_test": "High",
        "diabetes_med": 1,
        "medication_change": 1
    }
    response = client.post("/api/predictions/readmission", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["readmission_probability"] > 0.60
    assert data["risk_level"] == "High Risk"
    assert len(data["contributing_factors"]) > 0
    assert len(data["clinical_recommendations"]) > 0

def test_predict_readmission_low_risk(client):
    payload = {
        "age_group": "20-40",
        "gender": "Male",
        "admission_type": "Elective",
        "time_in_hospital": 2,
        "num_lab_procedures": 20,
        "num_procedures": 1,
        "num_medications": 6,
        "number_outpatient": 0,
        "number_emergency": 0,
        "number_inpatient": 0,
        "primary_diagnosis": "Injury",
        "comorbidity_score": 0,
        "glucose_test": "Normal",
        "a1c_test": "Normal",
        "diabetes_med": 0,
        "medication_change": 0
    }
    response = client.post("/api/predictions/readmission", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["readmission_probability"] < 0.35
    assert data["risk_level"] == "Low Risk"

def test_get_model_benchmarks(client):
    response = client.get("/api/predictions/benchmarks")
    assert response.status_code == 200
    data = response.json()
    assert "Gradient Boosting" in data["models"]
    assert "Random Forest" in data["models"]
    assert "Logistic Regression" in data["models"]
    assert len(data["top_feature_importances"]) > 0
