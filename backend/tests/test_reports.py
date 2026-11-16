"""
Tests for AI Medical Report Analyzer
"""

def test_get_sample_reports(client):
    response = client.get("/api/reports/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 2

def test_analyze_text_report(client):
    sample_text = (
        "METABOLIC LAB WORK:\n"
        "Fasting Blood Glucose: 145.0 mg/dL\n"
        "HbA1c: 7.4 %\n"
        "Serum Creatinine: 1.0 mg/dL\n"
        "Total Cholesterol: 230.0 mg/dL\n"
        "Clinical impression: Hyperglycemia and Dyslipidemia noted."
    )
    response = client.post(
        "/api/reports/analyze-text",
        json={"text": sample_text, "report_name": "Test_Report.txt"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["biomarkers_detected"]) >= 3
    assert any(b["name"] == "Fasting Blood Glucose" and b["status"] == "ELEVATED" for b in data["biomarkers_detected"])
    assert any(t["term"] == "Hyperglycemia" for t in data["medical_terms_translated"])
    assert len(data["suggested_physician_questions"]) > 0
