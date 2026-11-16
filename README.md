# MEDPULSE AI — Healthcare Intelligence & Decision Support Platform

![MEDPULSE AI Banner](https://img.shields.io/badge/Aesthetic-Black%20%26%20Pink%20(%23080808%20%2F%20%23FF4D9D)-ff4d9d?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python%203-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn%20(ROC--AUC%200.901)-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passed-10B981?style=for-the-badge)

---

## 1. Project Introduction

**MEDPULSE AI** is an advanced, production-quality artificial intelligence platform engineered for inpatient healthcare analytics, continuous hemodynamic vitals telemetry, clinical natural language report understanding, and 30-day hospital readmission predictive modeling.

Designed as an institutional clinical decision-support and academic demonstration system, MEDPULSE AI empowers healthcare teams to proactively identify high-risk patients prior to discharge, detect out-of-range physiological telemetry events, and translate complex laboratory diagnostics into actionable clinical recommendations.

---

## 2. Problem Statement & Clinical Objectives

### The Challenge
Hospital readmission within 30 days of inpatient discharge represents a multi-billion dollar healthcare dilemma globally and is a primary metric evaluated under the Centers for Medicare & Medicaid Services (CMS) Hospital Readmissions Reduction Program (HRRP). High acute readmission rates are frequently driven by uncoordinated discharge plans, unaddressed comorbidities, medication changes, and delayed outpatient follow-ups.

### Objectives
1. **Accurate Risk Stratification**: Machine-learning predictive models to estimate 30-day readmission likelihood upon discharge without data leakage.
2. **Dynamic Telemetry Surveillance**: Continuous longitudinal tracking of core vital signs (Heart Rate, Blood Pressure, Temperature, SpO2, Respiratory Rate) with automated clinical abnormality alerts.
3. **Transparent Symptom Triage**: Rule-based Emergency Severity Index (ESI) triage calculating clinical acuity scores (0-100) and screening for acute red flags.
4. **Biomedical Document NLP**: Text extraction from laboratory PDF reports, biomarker detection, reference range validation, and plain-English translations for patients and caregivers.

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) in TypeScript
- **Styling**: Tailwind CSS with custom **Black and Pink** design tokens
- **Aesthetic**:
  - Primary Background: `#080808`
  - Secondary Surface: `#101010`
  - Card Glassmorphism: `#151515` with `backdrop-filter: blur(14px)`
  - Primary Pink: `#FF4D9D`
  - Secondary Soft Pink: `#FFB6D5`
  - Typography: Pure White (`#FFFFFF`) & Muted Text (`#A1A1AA`)
- **Data Visualization**: Recharts (Hemodynamic telemetry area charts, ROC-AUC comparison bars, and risk category distribution pie charts)
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.13 / FastAPI (Asynchronous high-performance REST APIs)
- **Data Validation**: Pydantic v2 schemas with strict typing
- **Database ORM**: SQLAlchemy 2.0
- **Database Engine**: SQLite zero-config local default with direct PostgreSQL support
- **Authentication & Security**: JWT (HMAC-SHA256) with Bcrypt password hashing
- **Document Processing**: PyPDF for multi-page medical PDF text extraction

### Machine Learning
- **Libraries**: Scikit-Learn, Pandas, NumPy, Scipy, Joblib
- **Algorithms Evaluated**:
  - Logistic Regression (L2 Regularized Baseline)
  - Decision Tree Classifier (CART)
  - Random Forest Classifier (Bagging Ensemble)
  - **Gradient Boosting Classifier (Production Selected — ROC-AUC: 0.9007)**
- **Artifact Serialization**: Serialized Joblib preprocessor and model pipelines

---

## 4. Platform Modules & Features

```
medpulse-ai/
├── 1. Clinical Overview Dashboard    -> Cohort telemetry, risk breakdowns, active inpatient roster
├── 2. 30-Day Readmission Modeling    -> Live ML inference, factor attribution, 4-algorithm benchmark
├── 3. AI Symptom Triage              -> Multi-symptom acuity scoring (0-100), red flag screening
├── 4. Vitals Telemetry               -> 24-hour hemodynamic charts, automated out-of-range alerts
├── 5. Medical Report NLP             -> PDF upload, biomarker extraction, layman translations
└── 6. Population Analytics           -> Age distribution, 7-day trendlines, JSON analytical export
```

### A. Hospital Readmission Predictive Modeling
- Takes 16 clinical parameters: Age group, admission acuity, length of stay, procedure counts, lab procedures, medication adjustments, prior 12-month inpatient/emergency/outpatient visits, primary ICD-10 diagnostic category, Charlson Comorbidity Index, and glycemic markers (HbA1c & Fasting Glucose).
- Predicts readmission likelihood with confidence intervals and stratifies patients into **Low Risk (<35%)**, **Moderate Risk (35-60%)**, and **High Risk (>60%)**.
- Provides explicit feature attribution explanations indicating what drove the risk score up or down.

### B. Vitals Telemetry Monitoring
- Real-time tracking of:
  - Heart Rate (bpm)
  - Blood Pressure (Systolic & Diastolic mmHg)
  - Body Temperature (°C)
  - Oxygen Saturation SpO2 (%)
  - Respiratory Rate (breaths/min)
- Automatically assesses thresholds for Tachycardia, Bradycardia, Stage 2 Hypertension, Hypertensive Emergency, Hypoxemia, and Febrile events.

### C. AI Symptom Analyzer
- Transparent clinical rule-based engine covering Cardiovascular, Respiratory, Neurological, Gastrointestinal, and Systemic categories.
- Evaluates symptom severity (scale 1-10), duration, age, and pre-existing comorbidities.
- Returns Urgency Category: `EMERGENCY_IMMEDIATE`, `URGENT_EVALUATION`, `SEMI_URGENT`, `ROUTINE_CARE`, or `SELF_MANAGEMENT`.

### D. AI Medical Report Analyzer
- Ingests PDF or text diagnostic reports.
- Extracts critical biomarkers (Hemoglobin, WBC, Platelets, Fasting Glucose, HbA1c, Creatinine, BUN, Cholesterol, LDL).
- Flags values against standard adult reference intervals.
- Translates medical terminology (e.g., *Hyperglycemia*, *Leukocytosis*, *Microcytic Anemia*, *Dyslipidemia*) into plain English.

---

## 5. Machine Learning Methodology & Evaluation

### Dataset Attribution
Modeled on clinical inpatient discharge benchmarks derived from the UCI 130-US Hospitals Diabetes & Inpatient Readmission Study (Virginia Commonwealth University). 10,000 synthetic clinical records reflecting real-world clinical distributions with **zero patient identifiable information (PII)**.

### Model Benchmark Matrix (Test Split N=2,000)

| Algorithm | ROC-AUC | Accuracy | Precision | Recall (Sensitivity) | F1-Score | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Gradient Boosting** | **0.9007** | **82.60%** | **83.80%** | **92.09%** | **0.8775** | **Selected Production** |
| **Logistic Regression** | 0.9075 | 81.65% | 91.20% | 80.64% | 0.8560 | Linear Baseline |
| **Random Forest** | 0.8808 | 80.40% | 89.01% | 81.01% | 0.8483 | Bagging Ensemble |
| **Decision Tree** | 0.7744 | 67.55% | 85.00% | 63.19% | 0.7249 | Rule Tree Baseline |

*Stratified 80/20 train/test split (`random_state=42`). Preprocessor and model pipelines serialized in `backend/ml/models/`.*

---

## 6. Project Directory Structure

```
medpulse-ai/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST endpoints (auth, patients, vitals, symptoms, reports, predictions, analytics)
│   │   ├── core/            # Config, security (Bcrypt, JWT), database engine, seed script
│   │   ├── models/          # SQLAlchemy ORM models (User, Patient, VitalsRecord, MedicalReport, PredictionRecord)
│   │   ├── schemas/         # Pydantic v2 request/response validation schemas
│   │   ├── services/        # ML inference service, symptom triage engine, PDF report NLP
│   │   └── main.py          # FastAPI application entrypoint with CORS & lifecycle
│   ├── ml/
│   │   ├── data/            # Clinical readmissions dataset (10,000 rows)
│   │   ├── notebooks/       # Jupyter EDA & training walkthrough notebook
│   │   ├── preprocessing/   # Scaler & one-hot encoding pipeline
│   │   ├── training/        # Multi-model training & benchmark script
│   │   ├── evaluation/      # Model evaluation & confusion matrix generator
│   │   └── models/          # Serialized .joblib artifacts and benchmark JSONs
│   ├── tests/               # Backend Pytest test suite (14 test cases)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router pages (Landing, Login, Register, Dashboard, Vitals, Predictions, Symptoms, Reports, Analytics, Profile)
│   ├── components/          # Reusable UI components (Navbar, Sidebar, Footer, Telemetry charts)
│   ├── lib/                 # Backend API client, token utilities, Tailwind helpers
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts   # Custom Black & Pink theme tokens
│   └── tsconfig.json
├── docs/                    # Architecture, ML methodology, Dataset documentation, REST API reference
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 7. Installation & Local Execution

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain ML models
python ml/training/train_models.py

# Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API available at: `http://localhost:8000` | Interactive Swagger Docs: `http://localhost:8000/docs`*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build & test production bundle
npm run build

# Start the Next.js development server
npm run dev
```
*Frontend web application available at: `http://localhost:3000`*

### 3. Docker Compose (Full Stack Deployment)
```bash
docker-compose up --build
```

---

## 8. Demonstration Credentials

Pre-seeded with realistic inpatient profiles and demonstration credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Attending Clinician** | `clinician@medpulse.ai` | `Medpulse@2026` |
| **Patient / Caregiver** | `patient@medpulse.ai` | `Medpulse@2026` |

*1-Click quick fill buttons are available directly on the login screen.*

---

## 9. Testing & Quality Assurance

Run the comprehensive Pytest backend suite:
```bash
python -m pytest backend/tests -v
```

**Results: 14 / 14 Tests Passing (100% Pass Rate)**
- `test_login_demo_clinician`: PASSED
- `test_login_invalid_password`: PASSED
- `test_register_new_user`: PASSED
- `test_list_patients`: PASSED
- `test_record_abnormal_vitals_triggers_alert`: PASSED
- `test_get_patient_telemetry`: PASSED
- `test_predict_readmission_high_risk`: PASSED
- `test_predict_readmission_low_risk`: PASSED
- `test_get_model_benchmarks`: PASSED
- `test_get_sample_reports`: PASSED
- `test_analyze_text_report`: PASSED
- `test_symptom_list`: PASSED
- `test_analyze_emergency_red_flag_symptoms`: PASSED
- `test_analyze_mild_symptoms`: PASSED

---

## 10. Limitations & Future Scope

### Limitations
- **Academic Demonstration**: The models and triage logic are designed for decision-support demonstration and must not replace professional clinical evaluation.
- **Biomarker Scope**: Current PDF report extraction targets common metabolic, blood count, renal, and lipid panels; advanced genetic and microscopic histopathology panels require specialized OCR engines.

### Future Scope
- Integration with FHIR / HL7 clinical health interoperability standards.
- Real-time WebSocket streaming for continuous wearable Bluetooth Low Energy (BLE) ECG telemetry.
- Multi-modal chest X-ray deep learning classification (DenseNet / Vision Transformer).

---

## 11. Clinical Safety & Legal Disclaimer

> [!CAUTION]
> **MEDPULSE AI is an academic research and clinical decision-support demonstration platform.** It is not an FDA-cleared diagnostic medical device and does not provide formal medical diagnoses, clinical determinations, or treatment prescriptions. Any insights, triage scores, or predictions generated by this platform must be independently evaluated by a licensed medical professional. In an emergency, immediately contact local emergency medical services (911 / 112).

---

## 12. License & Attribution

This project is licensed under the MIT License. Developed for academic portfolio demonstration inside [https://github.com/realpukar/medpulse-ai](https://github.com/realpukar/medpulse-ai).
