"""
MEDPULSE AI — Inpatient Readmission Dataset Generator
Generates a clinically-grounded benchmark dataset (N=10,000) modeled on
the UCI 130-US Hospitals Diabetes & Inpatient Readmission Study.
Zero PII. Reproducible seed.
"""

import os
import numpy as np
import pandas as pd

def generate_clinical_readmission_dataset(n_samples: int = 10000, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    age_brackets = ['0-20', '20-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+']
    age_probs = [0.02, 0.08, 0.12, 0.20, 0.28, 0.20, 0.08, 0.02]
    age_group = np.random.choice(age_brackets, size=n_samples, p=age_probs)

    gender = np.random.choice(['Female', 'Male', 'Other'], size=n_samples, p=[0.52, 0.47, 0.01])
    admission_types = ['Emergency', 'Urgent', 'Elective', 'Trauma']
    admission_type = np.random.choice(admission_types, size=n_samples, p=[0.55, 0.25, 0.17, 0.03])

    # Length of hospital stay (days): gamma-distributed around ~4.5 days
    time_in_hospital = np.clip(np.random.gamma(shape=3.0, scale=1.5, size=n_samples).astype(int) + 1, 1, 14)

    # Diagnostic procedures and lab workload
    num_lab_procedures = np.clip(np.random.normal(loc=43, scale=18, size=n_samples).astype(int), 1, 120)
    num_procedures = np.clip(np.random.poisson(lam=1.3, size=n_samples), 0, 6)
    num_medications = np.clip(np.random.normal(loc=16, scale=7, size=n_samples).astype(int), 1, 45)

    # Prior healthcare utilization in previous 12 months
    number_outpatient = np.clip(np.random.exponential(scale=0.8, size=n_samples).astype(int), 0, 15)
    number_emergency = np.clip(np.random.exponential(scale=0.5, size=n_samples).astype(int), 0, 15)
    number_inpatient = np.clip(np.random.exponential(scale=0.6, size=n_samples).astype(int), 0, 12)

    # Diagnoses
    diagnoses = ['Circulatory', 'Respiratory', 'Endocrine', 'Digestive', 'Injury', 'Musculoskeletal', 'Other']
    diag_probs = [0.32, 0.18, 0.16, 0.11, 0.08, 0.07, 0.08]
    primary_diagnosis = np.random.choice(diagnoses, size=n_samples, p=diag_probs)

    # Comorbidity Index approximation (Charlson score 0-8)
    comorbidity_score = np.clip(np.random.poisson(lam=2.1, size=n_samples), 0, 8)

    # Glycemic tests
    glucose_test = np.random.choice(['None', 'Normal', 'High'], size=n_samples, p=[0.75, 0.15, 0.10])
    a1c_test = np.random.choice(['None', 'Normal', 'High'], size=n_samples, p=[0.78, 0.12, 0.10])

    diabetes_med = np.random.choice([0, 1], size=n_samples, p=[0.24, 0.76])
    medication_change = np.random.choice([0, 1], size=n_samples, p=[0.54, 0.46])

    # Ground-truth clinical risk logit function (evidence-based predictors of 30-day readmission)
    # Risk factors: Prior inpatient stays, emergency visits, higher comorbidity, circulatory/respiratory illness,
    # high medication count, high A1C, and older age.
    age_risk_weights = {'0-20': -0.8, '20-40': -0.5, '40-50': -0.2, '50-60': 0.1,
                        '60-70': 0.35, '70-80': 0.6, '80-90': 0.85, '90+': 1.1}
    age_risk = np.array([age_risk_weights[a] for a in age_group])

    diag_risk_weights = {'Circulatory': 0.5, 'Respiratory': 0.45, 'Endocrine': 0.3,
                         'Digestive': 0.1, 'Injury': -0.2, 'Musculoskeletal': -0.3, 'Other': 0.0}
    diag_risk = np.array([diag_risk_weights[d] for d in primary_diagnosis])

    adm_risk_weights = {'Emergency': 0.4, 'Trauma': 0.3, 'Urgent': 0.2, 'Elective': -0.4}
    adm_risk = np.array([adm_risk_weights[a] for a in admission_type])

    a1c_risk = np.array([0.5 if a == 'High' else (-0.1 if a == 'Normal' else 0.0) for a in a1c_test])
    glucose_risk = np.array([0.4 if g == 'High' else (-0.05 if g == 'Normal' else 0.0) for g in glucose_test])

    logit = (
        -2.2
        + 0.55 * number_inpatient
        + 0.35 * number_emergency
        + 0.12 * number_outpatient
        + 0.18 * comorbidity_score
        + 0.06 * time_in_hospital
        + 0.02 * num_medications
        + 0.005 * num_lab_procedures
        + age_risk
        + diag_risk
        + adm_risk
        + a1c_risk
        + glucose_risk
        + 0.2 * medication_change
        + np.random.normal(loc=0, scale=0.5, size=n_samples) # clinical stochasticity
    )

    readmit_probs = 1.0 / (1.0 + np.exp(-logit))
    readmitted_30d = (readmit_probs >= 0.42).astype(int)

    df = pd.DataFrame({
        'patient_id': [f"MP-{100000 + i}" for i in range(n_samples)],
        'age_group': age_group,
        'gender': gender,
        'admission_type': admission_type,
        'time_in_hospital': time_in_hospital,
        'num_lab_procedures': num_lab_procedures,
        'num_procedures': num_procedures,
        'num_medications': num_medications,
        'number_outpatient': number_outpatient,
        'number_emergency': number_emergency,
        'number_inpatient': number_inpatient,
        'primary_diagnosis': primary_diagnosis,
        'comorbidity_score': comorbidity_score,
        'glucose_test': glucose_test,
        'a1c_test': a1c_test,
        'diabetes_med': diabetes_med,
        'medication_change': medication_change,
        'readmitted_30d': readmitted_30d
    })

    return df

if __name__ == '__main__':
    data_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'hospital_readmissions.csv')
    df = generate_clinical_readmission_dataset(n_samples=10000, random_seed=42)
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} records at {csv_path}")
    print(f"Readmission Rate (30-day): {df['readmitted_30d'].mean()*100:.2f}%")
