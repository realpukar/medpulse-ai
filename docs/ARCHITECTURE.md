# MEDPULSE AI — System Architecture & Design

## 1. High-Level Architecture
MEDPULSE AI is designed as a decoupled, multi-tier healthcare intelligence platform:

```
+---------------------------------------------------------------------------------+
|                                 USER BROWSER                                    |
|  +---------------------------------------------------------------------------+  |
|  |                 Next.js 15 App Router Frontend (TypeScript)               |  |
|  |   - Premium Dark (#080808) & Pink (#FF4D9D) Glassmorphism Theme           |  |
|  |   - Framer Motion Micro-Interactions & Telemetry Charts (Recharts)        |  |
|  |   - Auth Sessions & Role Guarding                                         |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------+-----------------------------------------+
                                        |  REST API Requests (JSON / Bearer JWT)
                                        v
+---------------------------------------------------------------------------------+
|                              FASTAPI BACKEND SERVICE                            |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | Authentication API  |  | Patients & Vitals API|  | AI Symptom Engine      |  |
|  | (JWT, Bcrypt)       |  | (CRUD & Anomaly Flag)|  | (Clinical Rules Engine)|  |
|  +---------------------+  +----------------------+  +------------------------+  |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | Medical Report NLP  |  | Readmission ML API   |  | Healthcare Analytics   |  |
|  | (PyPDF, Extraction) |  | (Scikit-Learn Joblib)|  | (Aggregate Statistics) |  |
|  +---------------------+  +----------------------+  +------------------------+  |
+-------------------+-----------------------------------+-------------------------+
                    |                                   |
                    v                                   v
+---------------------------------------+   +-------------------------------------+
|          DATABASE LAYER               |   |        AI/ML ARTIFACTS LAYER        |
|  SQLAlchemy ORM                       |   |  Scikit-Learn Serialized Pipeline   |
|  - SQLite (Local zero-config default) |   |  - Preprocessor (Scaler + Encoder)  |
|  - PostgreSQL (Production ready)      |   |  - Readmission Predictor Model      |
|                                       |   |  - Model Metrics & Benchmark JSON   |
+---------------------------------------+   +-------------------------------------+
```

## 2. Component Details

### A. Frontend Layer
- **Framework**: Next.js (App Router) in TypeScript.
- **Styling**: Tailwind CSS with custom MedPulse Black & Pink tokens (`#080808`, `#101010`, `#151515`, `#FF4D9D`, `#FFB6D5`).
- **Visuals & Charts**: Recharts for interactive hemodynamic telemetry, risk distribution pie charts, and model comparison bar charts.
- **Motion**: Framer Motion for subtle pulsing animations, page transitions, and status alerts.
- **State & Networking**: REST API client with local JWT token storage, automatic authorization header injection, and responsive loading skeletons.

### B. Backend API Layer
- **Framework**: FastAPI (Asynchronous Python 3).
- **Validation**: Pydantic v2 schemas for strict input verification and automatic OpenAPI documentation.
- **Security**: JWT authentication (HMAC-SHA256) with passlib/bcrypt password hashing.
- **ORM & Storage**: SQLAlchemy 2.0 with models for Users, Patients, Vitals Records, Medical Reports, and Prediction Logs.

### C. AI/ML Engineering Layer
- **Algorithm Suite**: Logistic Regression, Decision Trees, Random Forest, and Gradient Boosting.
- **Trained on**: 10,000 clinically grounded inpatient records based on UCI 130-US Hospitals benchmark.
- **Inference Pipeline**: Feature vector construction -> One-Hot Categorical Encoding -> Standard Scaler -> Ensemble Prediction -> Probabilistic Risk Score + Feature Contribution Explanations.

### D. Medical Natural Language Processing
- **Report Ingestion**: Multi-page PDF text extraction via `pypdf`.
- **Clinical Entity Extraction**: Regex & dictionary pattern matching for standard lab biomarkers (Glucose, HbA1c, Hemoglobin, WBC, Platelets, Creatinine, Blood Pressure, Cholesterol).
- **Layman Translation**: Translates complex diagnostic jargon into patient-understandable summaries with recommended questions for physicians.
