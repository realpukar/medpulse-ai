# MEDPULSE AI — Machine Learning Methodology & Evaluation

## 1. Executive Summary
MEDPULSE AI provides clinical decision support by modeling the risk of 30-day hospital readmission based on clinical and demographic indicators. The predictive pipeline is engineered using scikit-learn, with data preprocessed to prevent data leakage and evaluated across multiple classification algorithms.

## 2. Algorithms Evaluated
We implement and compare four standard classification algorithms:

1. **Logistic Regression (L2 Regularized)**
   - Linear baseline classifier with balanced class weighting.
   - Provides clear coefficient interpretability for odds-ratio risk calculations.
2. **Decision Tree Classifier (CART)**
   - Non-linear rule-based tree model with `max_depth=6` to prevent overfitting.
   - Transparent clinical decision rules.
3. **Random Forest Classifier (Ensemble Bagging)**
   - 150 bagged decision trees with out-of-bag feature evaluation.
   - Robust against variance, handles complex feature interactions, provides Gini feature importance.
4. **Gradient Boosting Classifier (Ensemble Boosting)**
   - Sequentially optimizes pseudo-residuals with learning rate 0.1 and max depth 4.
   - High discrimination performance across clinical risk stratification boundaries.

## 3. Evaluation Metrics & Class Imbalance Strategy
Healthcare datasets commonly exhibit class imbalance (readmissions occur in ~15-25% of cases). Evaluating on raw accuracy alone would yield misleading results. Therefore, our pipeline computes and compares:
- **ROC-AUC (Receiver Operating Characteristic - Area Under Curve)**: Primary ranking metric, measuring discriminative power across all decision thresholds.
- **Precision (Positive Predictive Value)**: Proportion of flagged patients who were genuinely readmitted (minimizes alarm fatigue for clinicians).
- **Recall (Sensitivity)**: Proportion of readmitted patients successfully flagged by the model (minimizes missed high-risk cases).
- **F1-Score**: Harmonic mean of Precision and Recall.
- **Confusion Matrix**: Full breakdown of True Positives, False Positives, True Negatives, and False Negatives.

## 4. Pipeline & Inference Architecture
- **Offline Training**: `backend/ml/training/train_models.py` executes data loading, exploratory analysis, preprocessing, train/test splitting, hyperparameter fitting, and model evaluation.
- **Artifact Serialization**:
  - `readmission_model.joblib`: Serialized production model (Random Forest / Gradient Boosting).
  - `preprocessor.joblib`: StandardScaler and categorical encoders fitted exclusively on train data.
  - `model_comparison.json`: Complete benchmark metrics across all four algorithms.
  - `feature_importance.json`: Top clinical risk factors rank-ordered.
- **Online FastAPI Serving**: `backend/app/services/ml_service.py` loads the serialized artifacts at startup for low-latency (<50ms) inference via REST API `/api/predictions/readmission`.

## 5. Clinical Safety & Decision Support Notice
The predictive outputs of MEDPULSE AI are intended strictly for clinical decision support and academic demonstration. They are not intended as diagnostic tools or standalone treatment determinants.
