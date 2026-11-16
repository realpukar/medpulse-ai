"""
Tests for Symptom Analysis Engine
"""

def test_symptom_list(client):
    response = client.get("/api/symptoms/list")
    assert response.status_code == 200
    symptoms = response.json()
    assert len(symptoms) >= 15
    assert any(s["id"] == "chest_pain" for s in symptoms)

def test_analyze_emergency_red_flag_symptoms(client):
    payload = {
        "age": 62,
        "gender": "Male",
        "symptoms": ["chest_pain", "shortness_of_breath_exertion"],
        "severity": 9,
        "duration_days": 1,
        "pre_existing_conditions": ["Hypertension", "Coronary Artery Disease"]
    }
    response = client.post("/api/symptoms/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["urgency_level"] == "EMERGENCY_IMMEDIATE"
    assert "Chest Pain or Pressure" in data["red_flags_present"]
    assert "DISCLAIMER" in data["disclaimer"]

def test_analyze_mild_symptoms(client):
    payload = {
        "age": 28,
        "gender": "Female",
        "symptoms": ["sore_throat"],
        "severity": 3,
        "duration_days": 2,
        "pre_existing_conditions": []
    }
    response = client.post("/api/symptoms/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["urgency_level"] in ["SELF_MANAGEMENT", "ROUTINE_CARE"]
