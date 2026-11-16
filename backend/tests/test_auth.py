"""
Tests for Authentication: Registration, Login, and Profile
"""

def test_login_demo_clinician(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "clinician@medpulse.ai", "password": "Medpulse@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "clinician@medpulse.ai"
    assert data["user"]["role"] == "clinician"

def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "clinician@medpulse.ai", "password": "WrongPassword!"}
    )
    assert response.status_code == 401

def test_register_new_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "dr.carter@hospital.org",
            "password": "SecurePassword123!",
            "full_name": "Dr. John Carter, MD",
            "role": "doctor"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "dr.carter@hospital.org"
    assert "access_token" in data
