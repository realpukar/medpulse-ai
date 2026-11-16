# MEDPULSE AI — REST API Reference Documentation

All endpoints are hosted at `http://localhost:8000/api` (Swagger UI at `http://localhost:8000/docs`).

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new user (doctor, clinician, researcher, patient).
  - Body: `{"email": "...", "password": "...", "full_name": "...", "role": "..."}`
  - Returns: `{"access_token": "...", "token_type": "bearer", "user": {...}}`
- `POST /api/auth/login`: Authenticate with email and password.
  - Body: `{"email": "...", "password": "..."}`
  - Returns: `{"access_token": "...", "token_type": "bearer", "user": {...}}`
- `GET /api/auth/me`: Fetch authenticated user profile (Requires Bearer token).

## 2. Inpatient Management (`/api/patients`)
- `GET /api/patients`: List admitted inpatients with optional `risk_category` and `status` query filters.
- `POST /api/patients`: Register new inpatient record (MRN, name, age, primary diagnosis, room).
- `GET /api/patients/{id}`: Detailed inpatient record.
- `PUT /api/patients/{id}`: Update patient clinical status or diagnosis.

## 3. Vitals Telemetry (`/api/vitals`)
- `POST /api/vitals`: Record bedside hemodynamic telemetry (Heart Rate, Blood Pressure, Temp, SpO2, Resp Rate). Automatically detects clinical anomalies.
- `GET /api/vitals/patient/{id}`: Returns historical vitals time series and anomaly counts.
- `GET /api/vitals/alerts`: List recent out-of-range clinical events across all patients.

## 4. AI Symptom Triage (`/api/symptoms`)
- `GET /api/symptoms/list`: Retrieve recognized symptoms grouped by anatomical/systemic categories with red-flag markers.
- `POST /api/symptoms/analyze`: Evaluates symptom combinations, severity (1-10), duration, and comorbidities. Returns urgency category (`EMERGENCY_IMMEDIATE`, `URGENT_EVALUATION`, `SEMI_URGENT`, `SELF_MANAGEMENT`), acuity score, red flags, and disclaimer.

## 5. AI Medical Reports (`/api/reports`)
- `POST /api/reports/upload`: Multipart PDF upload (<10 MB). Extracts text, identifies biomarkers, checks normal ranges, translates medical jargon, and generates layman summary.
- `POST /api/reports/analyze-text`: Direct text parser for laboratory results.
- `GET /api/reports/samples`: Pre-configured demonstration clinical panels (Metabolic, CBC).

## 6. Machine Learning Predictions (`/api/predictions`)
- `POST /api/predictions/readmission`: 30-day hospital readmission inference using serialized Gradient Boosting model. Returns probabilistic risk score, risk level, confidence interval, and clinical factor attributions.
- `GET /api/predictions/benchmarks`: Comparative benchmark evaluation across Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting algorithms (ROC-AUC, Accuracy, Precision, Recall, F1, Confusion Matrix, and Feature Importances).

## 7. Population Analytics (`/api/analytics`)
- `GET /api/analytics/overview`: High-level inpatient metrics, age distributions, diagnosis breakdown, and telemetry averages.
- `GET /api/analytics/export`: Downloadable JSON data export of all inpatient cohort statistics.
