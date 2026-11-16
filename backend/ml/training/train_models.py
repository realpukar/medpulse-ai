"""
MEDPULSE AI — Model Training & Evaluation Suite
Trains and benchmarks 4 algorithms:
1. Logistic Regression
2. Decision Tree Classifier
3. Random Forest Classifier
4. Gradient Boosting Classifier

Saves serialized artifacts, metrics, and feature importances.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve
)

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.data.generate_dataset import generate_clinical_readmission_dataset
from ml.preprocessing.pipeline import ClinicalDataPreprocessor, load_and_split_data, TARGET_COL

def run_training_pipeline():
    base_ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_dir = os.path.join(base_ml_dir, 'data')
    models_dir = os.path.join(base_ml_dir, 'models')
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)

    csv_path = os.path.join(data_dir, 'hospital_readmissions.csv')
    if not os.path.exists(csv_path):
        print(f"Generating clinical readmissions dataset at {csv_path}...")
        df = generate_clinical_readmission_dataset(n_samples=10000, random_seed=42)
        df.to_csv(csv_path, index=False)
    else:
        print(f"Loading existing dataset from {csv_path}")

    # Split 80/20 stratified
    X_train_df, X_test_df, y_train, y_test = load_and_split_data(csv_path, test_size=0.2, random_state=42)

    # Fit preprocessor
    preprocessor = ClinicalDataPreprocessor()
    X_train_scaled = preprocessor.fit_transform(X_train_df)
    X_test_scaled = preprocessor.transform(X_test_df)
    feature_names = preprocessor.feature_columns

    print(f"Dataset split: Train shape = {X_train_scaled.shape}, Test shape = {X_test_scaled.shape}")
    print(f"Total engineered features: {len(feature_names)}")

    # Candidate models
    candidate_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, class_weight='balanced', random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=120, max_depth=10, class_weight='balanced', random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=120, learning_rate=0.1, max_depth=4, random_state=42)
    }

    results = {}
    fitted_models = {}

    for name, model in candidate_models.items():
        print(f"--> Training {name}...")
        model.fit(X_train_scaled, y_train)
        fitted_models[name] = model

        # Predictions
        y_pred = model.predict(X_test_scaled)
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test_scaled)[:, 1]
        else:
            y_prob = model.decision_function(X_test_scaled)

        # Metrics
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        roc_auc = float(roc_auc_score(y_test, y_prob))
        cm = confusion_matrix(y_test, y_pred).tolist()

        # Compute sample ROC points for frontend charting (10 thresholds)
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        # Sample down to 15 points for compact UI rendering
        step = max(1, len(fpr) // 15)
        roc_points = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr[::step], tpr[::step])]

        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            },
            "roc_curve": roc_points
        }
        print(f"    {name} -> ROC-AUC: {roc_auc:.4f} | F1: {f1:.4f} | Accuracy: {acc:.4f} | Recall: {rec:.4f}")

    # Determine best model based on ROC-AUC & F1 balance
    best_model_name = max(results, key=lambda k: results[k]["roc_auc"] + results[k]["f1_score"])
    best_model = fitted_models[best_model_name]
    print(f"\n[BEST MODEL SELECTED]: {best_model_name} (ROC-AUC: {results[best_model_name]['roc_auc']})")

    # Feature Importance calculation
    feature_importance_list = []
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_
        sorted_indices = np.argsort(importances)[::-1]
        for idx in sorted_indices[:15]:
            feature_importance_list.append({
                "feature": feature_names[idx],
                "importance": round(float(importances[idx]), 4)
            })
    elif hasattr(best_model, "coef_"):
        coefs = np.abs(best_model.coef_[0])
        sorted_indices = np.argsort(coefs)[::-1]
        for idx in sorted_indices[:15]:
            feature_importance_list.append({
                "feature": feature_names[idx],
                "importance": round(float(coefs[idx]), 4)
            })

    # Save artifacts
    model_path = os.path.join(models_dir, 'readmission_model.joblib')
    preprocessor_path = os.path.join(models_dir, 'preprocessor.joblib')
    joblib.dump(best_model, model_path)
    joblib.dump(preprocessor, preprocessor_path)

    comparison_path = os.path.join(models_dir, 'model_comparison.json')
    with open(comparison_path, 'w') as f:
        json.dump(results, f, indent=2)

    fi_path = os.path.join(models_dir, 'feature_importance.json')
    with open(fi_path, 'w') as f:
        json.dump(feature_importance_list, f, indent=2)

    metadata = {
        "model_name": best_model_name,
        "trained_at": datetime.now().isoformat(),
        "n_samples": 10000,
        "n_features": len(feature_names),
        "target": "30-day unplanned acute readmission",
        "best_metrics": results[best_model_name],
        "feature_names": feature_names
    }
    with open(os.path.join(models_dir, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print("All ML artifacts, preprocessors, and benchmark metrics successfully serialized to backend/ml/models/")
    return results

if __name__ == '__main__':
    run_training_pipeline()
