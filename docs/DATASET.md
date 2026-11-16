# MEDPULSE AI — Dataset Documentation

## 1. Overview and Problem Formulation
**Target Outcome**: 30-Day Hospital Readmission (`readmitted_30d`)
- **0**: Patient was not readmitted to an inpatient acute facility within 30 days of discharge.
- **1**: Patient experienced unplanned acute readmission within 30 days of discharge.

Hospital readmission rate is one of the most critical healthcare quality metrics globally (e.g., CMS Hospital Readmissions Reduction Program - HRRP). Early identification of high-risk patients enables targeted discharge planning, post-discharge telehealth follow-ups, and medication reconciliation to prevent avoidable readmissions.

## 2. Dataset Attribution & Methodology
This dataset is modeled directly on clinical inpatient discharge benchmarks (including features and distributions derived from the UCI 130-US Hospitals Diabetes & Inpatient Readmission Study, Center for Clinical and Translational Research, Virginia Commonwealth University). 

To ensure complete privacy compliance (HIPAA / GDPR), zero patient identifiable information (PII) is included. The benchmark contains 10,000 clinically grounded patient inpatient records reflecting real-world clinical distributions, multi-comorbidity patterns, laboratory intensity, and prior utilization history.

## 3. Feature Dictionary

| Feature Name | Type | Description | Values / Range |
| :--- | :--- | :--- | :--- |
| `patient_id` | String | Unique patient identifier | Synthetic alphanumeric |
| `age_group` | Categorical | Age bracket of patient | `0-20`, `20-40`, `40-50`, `50-60`, `60-70`, `70-80`, `80-90`, `90+` |
| `gender` | Categorical | Patient biological sex | `Male`, `Female`, `Other` |
| `admission_type` | Categorical | Admission acuity | `Emergency`, `Urgent`, `Elective`, `Trauma` |
| `time_in_hospital` | Integer | Length of hospital stay (days) | 1 to 14 |
| `num_lab_procedures` | Integer | Total diagnostic laboratory procedures performed | 1 to 120 |
| `num_procedures` | Integer | Non-laboratory surgical/diagnostic procedures | 0 to 6 |
| `num_medications` | Integer | Number of distinct medications administered | 1 to 45 |
| `number_outpatient` | Integer | Outpatient visits in preceding 12 months | 0 to 15 |
| `number_emergency` | Integer | Emergency department visits in preceding 12 months | 0 to 15 |
| `number_inpatient` | Integer | Inpatient admissions in preceding 12 months | 0 to 12 |
| `primary_diagnosis` | Categorical | Primary ICD-10 diagnostic category | `Circulatory`, `Respiratory`, `Endocrine`, `Digestive`, `Injury`, `Musculoskeletal`, `Other` |
| `comorbidity_score` | Integer | Charlson Comorbidity Index approximation | 0 to 8 |
| `glucose_test` | Categorical | Blood glucose test result during stay | `None`, `Normal`, `High` |
| `a1c_test` | Categorical | Glycated hemoglobin test result | `None`, `Normal`, `High` |
| `diabetes_med` | Binary | Whether diabetes medications were prescribed | `0` (No), `1` (Yes) |
| `medication_change` | Binary | Whether medication dosage was altered during stay | `0` (No), `1` (Yes) |
| **`readmitted_30d`** | Binary | **Target: Unplanned 30-day readmission** | **`0` (No), `1` (Yes)** |

## 4. Preprocessing & Splitting Pipeline
- **Missing Value Handling**: None/Not measured explicitly captured as discrete clinical categories (`None` for unmeasured lab tests).
- **Categorical Encoding**: One-Hot Encoding for non-ordinal features (`primary_diagnosis`, `admission_type`, `gender`, `age_group`).
- **Feature Scaling**: `StandardScaler` fitted exclusively on training split to eliminate data leakage.
- **Data Splitting**: Stratified 80/20 train/test split with `random_state=42` to guarantee exact test reproducibility.
- **Class Balancing**: Balanced sample weighting applied during training to handle real-world clinical imbalance without artificial oversampling distortion.
