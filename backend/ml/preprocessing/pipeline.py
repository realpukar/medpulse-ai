"""
MEDPULSE AI — ML Preprocessing Pipeline
Prepares clinical tabular data, handles encoding, scaling, and feature names.
"""

from typing import Tuple, List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

CATEGORICAL_COLS = [
    'age_group',
    'gender',
    'admission_type',
    'primary_diagnosis',
    'glucose_test',
    'a1c_test'
]

NUMERICAL_COLS = [
    'time_in_hospital',
    'num_lab_procedures',
    'num_procedures',
    'num_medications',
    'number_outpatient',
    'number_emergency',
    'number_inpatient',
    'comorbidity_score'
]

BINARY_COLS = [
    'diabetes_med',
    'medication_change'
]

TARGET_COL = 'readmitted_30d'

class ClinicalDataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.dummy_columns: List[str] = []
        self.feature_columns: List[str] = []
        self.fitted = False

    def fit(self, df: pd.DataFrame):
        X_df = df.copy()
        
        # One-hot encode categorical features
        X_cat = pd.get_dummies(X_df[CATEGORICAL_COLS], drop_first=False, dtype=float)
        self.dummy_columns = list(X_cat.columns)
        
        # Combine numerical, binary, and encoded categoricals
        X_all = pd.concat([X_df[NUMERICAL_COLS], X_df[BINARY_COLS], X_cat], axis=1)
        self.feature_columns = list(X_all.columns)
        
        # Fit scaler on numerical features only to preserve binary/one-hot values
        self.scaler.fit(X_df[NUMERICAL_COLS])
        self.fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.fitted:
            raise ValueError("Preprocessor has not been fitted yet.")
        
        X_df = df.copy()
        
        # Scale numericals
        scaled_nums = self.scaler.transform(X_df[NUMERICAL_COLS])
        scaled_nums_df = pd.DataFrame(scaled_nums, columns=NUMERICAL_COLS, index=X_df.index)
        
        # Encode categoricals with alignment
        X_cat = pd.get_dummies(X_df[CATEGORICAL_COLS], drop_first=False, dtype=float)
        X_cat = X_cat.reindex(columns=self.dummy_columns, fill_value=0.0)
        
        # Binary cols
        X_bin = X_df[BINARY_COLS].astype(float)
        
        X_combined = pd.concat([scaled_nums_df, X_bin, X_cat], axis=1)
        # Ensure exact column order
        X_combined = X_combined[self.feature_columns]
        return X_combined.to_numpy()

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        return self.fit(df).transform(df)

    def transform_single_dict(self, record: Dict[str, Any]) -> np.ndarray:
        df = pd.DataFrame([record])
        return self.transform(df)

def load_and_split_data(csv_path: str, test_size: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    df = pd.read_csv(csv_path)
    X = df.drop(columns=[TARGET_COL, 'patient_id'])
    y = df[TARGET_COL]
    return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)
