"""
MEDPULSE AI — Model Evaluation & Metric Validation
Loads serialized artifacts and prints a structured clinical benchmark table.
"""

import os
import json

def load_metrics_summary():
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../models'))
    comparison_file = os.path.join(models_dir, 'model_comparison.json')
    meta_file = os.path.join(models_dir, 'model_metadata.json')

    if not os.path.exists(comparison_file):
        raise FileNotFoundError(f"Missing {comparison_file}. Run train_models.py first.")

    with open(comparison_file, 'r') as f:
        comparison = json.load(f)

    with open(meta_file, 'r') as f:
        meta = json.load(f)

    return comparison, meta

def print_benchmark_table():
    comparison, meta = load_metrics_summary()
    print("=" * 85)
    print(f"MEDPULSE AI — HOSPITAL READMISSION BENCHMARK EVALUATION (N={meta.get('n_samples', 10000)})")
    print("=" * 85)
    header = f"{'Algorithm':<22} | {'ROC-AUC':<8} | {'Accuracy':<8} | {'Precision':<9} | {'Recall':<8} | {'F1-Score':<8}"
    print(header)
    print("-" * 85)
    for model_name, metrics in comparison.items():
        row = (
            f"{model_name:<22} | "
            f"{metrics['roc_auc']:<8.4f} | "
            f"{metrics['accuracy']:<8.4f} | "
            f"{metrics['precision']:<9.4f} | "
            f"{metrics['recall']:<8.4f} | "
            f"{metrics['f1_score']:<8.4f}"
        )
        print(row)
    print("=" * 85)
    print(f"Production Selected Model: {meta.get('model_name')} (Target: {meta.get('target')})")
    print("=" * 85)

if __name__ == '__main__':
    print_benchmark_table()
