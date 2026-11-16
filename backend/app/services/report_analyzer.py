"""
MEDPULSE AI — AI Medical Report Analyzer & NLP Clinical Entity Extractor
Parses PDF and textual laboratory reports, extracts biomarkers, compares against
reference intervals, and provides layman translations and physician discussion points.
"""

import re
import io
from typing import List, Dict, Any, Optional
from pypdf import PdfReader
from app.schemas.report import (
    BiomarkerResult,
    MedicalTermDefinition,
    ReportAnalysisResponse
)

# Established clinical reference intervals
BIOMARKER_STANDARDS = [
    {
        "name": "Hemoglobin (HGB)",
        "category": "Complete Blood Count",
        "patterns": [r"hemoglobin\b[:\s]+([\d\.]+)", r"\bhgb\b[:\s]+([\d\.]+)", r"\bhb\b[:\s]+([\d\.]+)"],
        "unit": "g/dL",
        "low": 12.0,
        "high": 17.5,
        "critical_low": 7.0,
        "ref": "12.0 - 17.5 g/dL",
        "low_desc": "Low hemoglobin indicates anemia, which may cause fatigue and pale skin.",
        "high_desc": "Elevated hemoglobin may point to dehydration, hypoxia, or polycythemia.",
        "norm_desc": "Hemoglobin is within optimal oxygen-carrying capacity range."
    },
    {
        "name": "White Blood Cell Count (WBC)",
        "category": "Complete Blood Count",
        "patterns": [r"white blood cells?\b[:\s]+([\d\.]+)", r"\bwbc\b[:\s]+([\d\.]+)"],
        "unit": "x10^3/uL",
        "low": 4.5,
        "high": 11.0,
        "critical_low": 2.0,
        "ref": "4.5 - 11.0 x10^3/uL",
        "low_desc": "Leukopenia: Reduced immune defense, which can occur from viral infections or bone marrow conditions.",
        "high_desc": "Leukocytosis: Elevated count commonly indicating active bacterial infection, inflammation, or physical stress.",
        "norm_desc": "WBC count is within standard immune surveillance limits."
    },
    {
        "name": "Platelets (PLT)",
        "category": "Complete Blood Count",
        "patterns": [r"platelets?\b[:\s]+([\d\.]+)", r"\bplt\b[:\s]+([\d\.]+)"],
        "unit": "x10^3/uL",
        "low": 150.0,
        "high": 450.0,
        "critical_low": 50.0,
        "ref": "150 - 450 x10^3/uL",
        "low_desc": "Thrombocytopenia: Low platelet count increases bruising and bleeding risk.",
        "high_desc": "Thrombocytosis: Elevated platelets can increase clotting risk or reflect reactive inflammation.",
        "norm_desc": "Platelet counts adequate for normal blood clotting."
    },
    {
        "name": "Fasting Blood Glucose",
        "category": "Metabolic Panel",
        "patterns": [r"fasting (?:blood )?glucose\b[:\s]+([\d\.]+)", r"\bglucose\b[:\s]+([\d\.]+)"],
        "unit": "mg/dL",
        "low": 70.0,
        "high": 100.0,
        "critical_low": 50.0,
        "ref": "70 - 99 mg/dL",
        "low_desc": "Hypoglycemia: Low blood sugar causing dizziness, shakiness, or confusion.",
        "high_desc": "Hyperglycemia: Elevated blood sugar indicating prediabetes, diabetes, or acute physiological stress.",
        "norm_desc": "Fasting glucose level is in the healthy euglycemic range."
    },
    {
        "name": "Hemoglobin A1c (HbA1c)",
        "category": "Metabolic Panel",
        "patterns": [r"hba1c\b[:\s]+([\d\.]+)", r"a1c\b[:\s]+([\d\.]+)", r"glycated hemoglobin\b[:\s]+([\d\.]+)"],
        "unit": "%",
        "low": 4.0,
        "high": 5.6,
        "critical_low": 3.0,
        "ref": "< 5.7%",
        "low_desc": "Below typical range, usually seen in hemolytic anemia or rare conditions.",
        "high_desc": "5.7-6.4% indicates prediabetes; >=6.5% is diagnostic criteria for Type 2 Diabetes.",
        "norm_desc": "Optimal 3-month average blood glucose control."
    },
    {
        "name": "Serum Creatinine",
        "category": "Renal Panel",
        "patterns": [r"creatinine\b[:\s]+([\d\.]+)", r"\bcr\b[:\s]+([\d\.]+)"],
        "unit": "mg/dL",
        "low": 0.6,
        "high": 1.2,
        "critical_low": 0.2,
        "ref": "0.6 - 1.2 mg/dL",
        "low_desc": "Low creatinine is usually benign, often associated with lower muscle mass.",
        "high_desc": "Elevated creatinine indicates reduced renal filtration function (kidney strain).",
        "norm_desc": "Healthy kidney filtration rate."
    },
    {
        "name": "Blood Urea Nitrogen (BUN)",
        "category": "Renal Panel",
        "patterns": [r"blood urea nitrogen\b[:\s]+([\d\.]+)", r"\bbun\b[:\s]+([\d\.]+)"],
        "unit": "mg/dL",
        "low": 7.0,
        "high": 20.0,
        "critical_low": 3.0,
        "ref": "7.0 - 20.0 mg/dL",
        "low_desc": "Low BUN can reflect low protein intake or advanced liver disease.",
        "high_desc": "Elevated BUN is frequently associated with dehydration, high protein intake, or renal insufficiency.",
        "norm_desc": "Normal nitrogen waste balance."
    },
    {
        "name": "Total Cholesterol",
        "category": "Lipid Panel",
        "patterns": [r"total cholesterol\b[:\s]+([\d\.]+)", r"cholesterol, total\b[:\s]+([\d\.]+)"],
        "unit": "mg/dL",
        "low": 120.0,
        "high": 200.0,
        "critical_low": 80.0,
        "ref": "< 200 mg/dL",
        "low_desc": "Very low cholesterol, sometimes noted in malabsorption or hyperthyroidism.",
        "high_desc": "Elevated total cholesterol, contributing to long-term atherosclerotic cardiovascular risk.",
        "norm_desc": "Desirable cardiovascular cholesterol level."
    },
    {
        "name": "LDL Cholesterol",
        "category": "Lipid Panel",
        "patterns": [r"ldl(?:-c)?\b[:\s]+([\d\.]+)", r"low density lipoprotein\b[:\s]+([\d\.]+)"],
        "unit": "mg/dL",
        "low": 50.0,
        "high": 100.0,
        "critical_low": 30.0,
        "ref": "< 100 mg/dL",
        "low_desc": "Low LDL, optimal for cardiovascular protection.",
        "high_desc": "Borderline/Elevated 'bad cholesterol', associated with arterial plaque development.",
        "norm_desc": "Optimal target for cardiovascular health."
    }
]

MEDICAL_TERMS_DICTIONARY = {
    "hyperglycemia": {
        "term": "Hyperglycemia",
        "plain_english": "High blood sugar level.",
        "context_note": "Occurs when insulin is insufficient or cells are resistant to insulin."
    },
    "leukocytosis": {
        "term": "Leukocytosis",
        "plain_english": "High white blood cell count.",
        "context_note": "A natural defense reaction indicating an infection, inflammation, or physical trauma."
    },
    "anemia": {
        "term": "Anemia",
        "plain_english": "Low red blood cell count or low hemoglobin.",
        "context_note": "Leads to reduced oxygen delivery to tissues, causing tiredness and fatigue."
    },
    "thrombocytopenia": {
        "term": "Thrombocytopenia",
        "plain_english": "Low blood platelet count.",
        "context_note": "Platelets help blood clot; a low number increases bleeding and bruising risk."
    },
    "dyslipidemia": {
        "term": "Dyslipidemia",
        "plain_english": "Imbalance in blood fats (cholesterol, triglycerides).",
        "context_note": "Increases long-term risk of arterial hardening if unmanaged."
    },
    "renal insufficiency": {
        "term": "Renal Insufficiency",
        "plain_english": "Reduced kidney function.",
        "context_note": "Kidneys are not clearing waste products from the bloodstream as efficiently as expected."
    },
    "microcytic": {
        "term": "Microcytic",
        "plain_english": "Red blood cells that are smaller than normal.",
        "context_note": "Most commonly associated with iron deficiency anemia."
    },
    "hypertension": {
        "term": "Hypertension",
        "plain_english": "High blood pressure.",
        "context_note": "Excess pressure against artery walls; chronic strain on heart and blood vessels."
    }
}

class ReportAnalyzerService:
    def extract_text_from_pdf_bytes(self, pdf_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Could not extract text from PDF document: {str(e)}")

    def analyze_report_text(self, text: str, filename: str = "Medical_Report.pdf") -> ReportAnalysisResponse:
        biomarkers: List[BiomarkerResult] = []
        lower_text = text.lower()

        # Match biomarkers using regex
        for b_meta in BIOMARKER_STANDARDS:
            for pat in b_meta["patterns"]:
                match = re.search(pat, lower_text)
                if match:
                    try:
                        val = float(match.group(1))
                        # Determine clinical status
                        if val < b_meta["low"]:
                            status = "LOW"
                            meaning = b_meta["low_desc"]
                        elif val > b_meta["high"]:
                            status = "ELEVATED"
                            meaning = b_meta["high_desc"]
                        else:
                            status = "NORMAL"
                            meaning = b_meta["norm_desc"]

                        biomarkers.append(BiomarkerResult(
                            name=b_meta["name"],
                            category=b_meta["category"],
                            value=val,
                            unit=b_meta["unit"],
                            reference_range=b_meta["ref"],
                            status=status,
                            clinical_meaning=meaning
                        ))
                        break # Stop checking other patterns for this biomarker
                    except ValueError:
                        continue

        # Find translated medical terms
        translated_terms: List[MedicalTermDefinition] = []
        for term_key, term_meta in MEDICAL_TERMS_DICTIONARY.items():
            if term_key in lower_text or term_meta["term"].lower() in lower_text:
                translated_terms.append(MedicalTermDefinition(
                    term=term_meta["term"],
                    plain_english=term_meta["plain_english"],
                    context_note=term_meta["context_note"]
                ))

        # Overall risk calculation
        elevated_or_low_count = sum(1 for b in biomarkers if b.status in ["ELEVATED", "LOW"])
        if elevated_or_low_count >= 3:
            overall_risk = "Attention Required - Multiple Out-of-Range Markers"
        elif elevated_or_low_count >= 1:
            overall_risk = "Moderate - Mild Variances Observed"
        else:
            overall_risk = "Normal - Values Within Reference Ranges"

        # Generate layman narrative summary
        if not biomarkers:
            summary_text = (
                "The report text was successfully extracted, but standard quantitative laboratory panels "
                "(such as Hemoglobin, Glucose, Creatinine, or Lipid markers) were not recognized in standard numerical format. "
                "Please review the document directly with your attending healthcare provider."
            )
        else:
            abnormal_names = [f"{b.name} ({b.value} {b.unit} - {b.status})" for b in biomarkers if b.status != "NORMAL"]
            normal_names = [b.name for b in biomarkers if b.status == "NORMAL"]

            parts = [f"Analysis completed for {len(biomarkers)} clinical laboratory measurements."]
            if abnormal_names:
                parts.append(f"Noteworthy out-of-range indicators detected: {', '.join(abnormal_names)}.")
            if normal_names:
                parts.append(f"Markers within standard healthy limits: {', '.join(normal_names)}.")
            summary_text = " ".join(parts)

        # Suggested physician questions
        questions = [
            "Are any of the out-of-range lab values urgent or related to my primary symptoms?",
            "Do any of my current medications need dose adjustment based on these kidney or metabolic markers?",
            "What dietary, lifestyle, or follow-up laboratory testing schedule is recommended?",
            "When should I repeat this lab panel to monitor progression or normalization?"
        ]

        return ReportAnalysisResponse(
            filename=filename,
            extracted_character_count=len(text),
            biomarkers_detected=biomarkers,
            medical_terms_translated=translated_terms,
            layman_summary=summary_text,
            overall_health_risk=overall_risk,
            suggested_physician_questions=questions,
            disclaimer=(
                "DISCLAIMER: This automated report analysis is for educational and clinical decision-support demonstration only. "
                "It does not constitute a clinical interpretation or formal laboratory diagnosis. Always consult with a licensed "
                "healthcare professional before making medical decisions."
            )
        )

    def get_sample_reports(self) -> List[Dict[str, str]]:
        return [
            {
                "title": "Comprehensive Metabolic & Lipid Panel (Elevated Glucose / LDL)",
                "description": "Routine outpatient follow-up panel showing elevated fasting glucose and mild dyslipidemia.",
                "sample_text": (
                    "LABORATORY DIAGNOSTIC REPORT - METABOLIC & LIPID PROFILE\n"
                    "Patient: Michael Vance | Age: 58 | Sex: Male\n"
                    "Clinical Indication: Routine follow-up, Type 2 Diabetes evaluation.\n\n"
                    "SUMMARY OF FINDINGS:\n"
                    "Fasting Blood Glucose: 138.0 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]\n"
                    "HbA1c: 7.2 % (Reference: < 5.7 %) [HIGH]\n"
                    "Serum Creatinine: 1.1 mg/dL (Reference: 0.6 - 1.2 mg/dL) [NORMAL]\n"
                    "Blood Urea Nitrogen: 18.0 mg/dL (Reference: 7.0 - 20.0 mg/dL) [NORMAL]\n"
                    "Total Cholesterol: 224.0 mg/dL (Reference: < 200 mg/dL) [HIGH]\n"
                    "LDL: 135.0 mg/dL (Reference: < 100 mg/dL) [HIGH]\n\n"
                    "CLINICAL IMPRESSION:\n"
                    "Patient exhibits mild hyperglycemia and persistent dyslipidemia. Renal function appears preserved with "
                    "normal serum creatinine and BUN. Recommendation: Dietary modification, exercise program, and discussion "
                    "of glycemic therapy optimization."
                )
            },
            {
                "title": "Complete Blood Count (CBC) with Mild Anemia & Leukocytosis",
                "description": "Inpatient admission workup demonstrating low hemoglobin and elevated WBC in response to respiratory infection.",
                "sample_text": (
                    "ACUTE CARE INPATIENT LAB REPORT - COMPLETE BLOOD COUNT\n"
                    "Patient: Eleanor Ross | Age: 67 | Sex: Female\n"
                    "Clinical Indication: Fever, productive cough, suspected community-acquired pneumonia.\n\n"
                    "HEMATOLOGY PANEL:\n"
                    "Hemoglobin: 10.4 g/dL (Reference: 12.0 - 16.0 g/dL) [LOW]\n"
                    "White Blood Cells: 14.8 x10^3/uL (Reference: 4.5 - 11.0 x10^3/uL) [HIGH]\n"
                    "Platelets: 285.0 x10^3/uL (Reference: 150 - 450 x10^3/uL) [NORMAL]\n\n"
                    "CLINICAL IMPRESSION:\n"
                    "Marked leukocytosis indicative of acute inflammatory/infectious process. Mild microcytic anemia noted. "
                    "Correlation with chest radiography and antibiotic therapy recommended."
                )
            }
        ]

report_analyzer = ReportAnalyzerService()
