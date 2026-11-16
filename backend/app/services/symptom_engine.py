"""
MEDPULSE AI — Clinical Symptom Triage & Rule-Based Analysis Engine
Demonstration and decision-support module based on emergency triage principles (ESI / Manchester).
Zero definitive claims. Transparent risk stratification.
"""

from typing import List, Dict, Any, Tuple
from app.schemas.symptom import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
    PossibleCondition
)

AVAILABLE_SYMPTOMS = [
    # Cardiovascular
    {"id": "chest_pain", "name": "Chest Pain or Pressure", "category": "Cardiovascular", "is_red_flag": True, "weight": 9.5},
    {"id": "palpitations", "name": "Rapid or Irregular Heartbeat (Palpitations)", "category": "Cardiovascular", "is_red_flag": False, "weight": 5.5},
    {"id": "shortness_of_breath_exertion", "name": "Shortness of Breath on Exertion", "category": "Cardiovascular", "is_red_flag": False, "weight": 6.5},
    {"id": "leg_swelling", "name": "Bilateral Ankle or Leg Swelling (Edema)", "category": "Cardiovascular", "is_red_flag": False, "weight": 5.0},
    {"id": "dizziness_standing", "name": "Lightheadedness or Dizziness when Standing", "category": "Cardiovascular", "is_red_flag": False, "weight": 4.5},

    # Respiratory
    {"id": "severe_dyspnea", "name": "Severe Shortness of Breath at Rest", "category": "Respiratory", "is_red_flag": True, "weight": 9.0},
    {"id": "wheezing", "name": "Audible Wheezing or Stridor", "category": "Respiratory", "is_red_flag": False, "weight": 6.0},
    {"id": "persistent_cough", "name": "Chronic or Dry Cough (>2 weeks)", "category": "Respiratory", "is_red_flag": False, "weight": 4.0},
    {"id": "hemoptysis", "name": "Coughing up Blood (Hemoptysis)", "category": "Respiratory", "is_red_flag": True, "weight": 8.5},
    {"id": "sore_throat", "name": "Sore Throat / Pharyngitis", "category": "Respiratory", "is_red_flag": False, "weight": 2.5},

    # Neurological
    {"id": "sudden_weakness", "name": "Sudden Weakness / Numbness on One Side (FAST)", "category": "Neurological", "is_red_flag": True, "weight": 10.0},
    {"id": "slurred_speech", "name": "Difficulty Speaking or Slurred Speech", "category": "Neurological", "is_red_flag": True, "weight": 9.8},
    {"id": "thunderclap_headache", "name": "Sudden 'Worst Headache of Life' (Thunderclap)", "category": "Neurological", "is_red_flag": True, "weight": 9.5},
    {"id": "mild_headache", "name": "Tension or Dull Headache", "category": "Neurological", "is_red_flag": False, "weight": 3.0},
    {"id": "vertigo", "name": "Room-Spinning Dizziness (Vertigo)", "category": "Neurological", "is_red_flag": False, "weight": 4.0},

    # Systemic / Infectious
    {"id": "high_fever", "name": "High Fever (>39°C / 102.2°F)", "category": "Systemic", "is_red_flag": False, "weight": 6.5},
    {"id": "fever_stiff_neck", "name": "High Fever with Stiff Neck and Photophobia", "category": "Systemic", "is_red_flag": True, "weight": 9.5},
    {"id": "fatigue_severe", "name": "Profound Generalized Fatigue", "category": "Systemic", "is_red_flag": False, "weight": 4.0},
    {"id": "unexplained_weight_loss", "name": "Unintentional Weight Loss", "category": "Systemic", "is_red_flag": False, "weight": 5.0},
    {"id": "night_sweats", "name": "Drenching Night Sweats", "category": "Systemic", "is_red_flag": False, "weight": 5.0},

    # Gastrointestinal
    {"id": "severe_abdominal_pain", "name": "Severe Acute Abdominal Pain with Guarding", "category": "Gastrointestinal", "is_red_flag": True, "weight": 8.5},
    {"id": "nausea_vomiting", "name": "Nausea and Persistent Vomiting", "category": "Gastrointestinal", "is_red_flag": False, "weight": 4.5},
    {"id": "hematemesis_melena", "name": "Vomiting Blood or Black Tarry Stools", "category": "Gastrointestinal", "is_red_flag": True, "weight": 9.0},
    {"id": "acid_reflux", "name": "Heartburn or Acid Regurgitation", "category": "Gastrointestinal", "is_red_flag": False, "weight": 2.5},
    {"id": "diarrhea", "name": "Watery Diarrhea (>3 episodes/day)", "category": "Gastrointestinal", "is_red_flag": False, "weight": 3.5}
]

SYMPTOM_MAP = {s["id"]: s for s in AVAILABLE_SYMPTOMS}

class SymptomEngine:
    def __init__(self):
        pass

    def get_all_symptoms(self) -> List[Dict[str, Any]]:
        return AVAILABLE_SYMPTOMS

    def analyze(self, req: SymptomAnalysisRequest) -> SymptomAnalysisResponse:
        symptom_objs = []
        for sid in req.symptoms:
            if sid in SYMPTOM_MAP:
                symptom_objs.append(SYMPTOM_MAP[sid])
            else:
                # Fuzzy match by name if user supplied custom string
                matched = next((s for s in AVAILABLE_SYMPTOMS if s["name"].lower() == sid.lower() or s["id"] == sid.lower()), None)
                if matched:
                    symptom_objs.append(matched)
                else:
                    symptom_objs.append({"id": sid, "name": sid, "category": "General", "is_red_flag": False, "weight": 4.0})

        # Identify red flags
        red_flags_present = [s["name"] for s in symptom_objs if s.get("is_red_flag", False)]
        has_red_flags = len(red_flags_present) > 0

        # Calculate clinical acuity score (0 - 100)
        base_weights = sum(s.get("weight", 4.0) for s in symptom_objs)
        severity_factor = (req.severity / 10.0) * 1.5
        
        # Age modifier (vulnerable extremes: >65 or <5)
        age_modifier = 1.25 if req.age >= 65 or req.age <= 5 else 1.0
        
        # Comorbidities modifier
        comorbidity_boost = 1.0 + (0.15 * len(req.pre_existing_conditions or []))
        
        # Duration factor
        duration_factor = 1.1 if req.duration_days > 7 else (1.3 if (has_red_flags and req.duration_days <= 1) else 1.0)

        acuity_score = min(100.0, round((base_weights * 2.8 * severity_factor * age_modifier * comorbidity_boost * duration_factor), 1))

        # Urgency Stratification
        if has_red_flags or acuity_score >= 80 or req.severity >= 9:
            urgency_level = "EMERGENCY_IMMEDIATE"
            urgency_title = "Immediate Emergency Medical Evaluation Required"
            urgency_color = "#FF4D9D" # Neon Pink / Warning
            urgency_description = "The reported symptoms include high-priority clinical red flags that require immediate evaluation at an Emergency Department or via Emergency Services (911/112)."
            recommended_actions = [
                "Call emergency medical services (911 / 112) or go to the nearest emergency room immediately.",
                "Do NOT attempt to drive yourself if experiencing chest pain, dizziness, or weakness.",
                "Keep emergency contact numbers and current medications readily accessible for paramedics."
            ]
        elif acuity_score >= 55 or req.severity >= 7 or req.duration_days >= 14:
            urgency_level = "URGENT_EVALUATION"
            urgency_title = "Urgent Medical Care Recommended (Within 12-24 Hours)"
            urgency_color = "#F59E0B" # Amber
            urgency_description = "Significant symptom intensity or prolonged duration warrants same-day medical attention at an Urgent Care clinic or prompt physician consultation."
            recommended_actions = [
                "Schedule a same-day visit at an urgent care clinic or contact your primary care physician's on-call service.",
                "Monitor vitals (temperature, blood pressure, pulse) every 4 hours.",
                "Seek immediate emergency care if symptoms suddenly escalate or difficulty breathing develops."
            ]
        elif acuity_score >= 35 or req.severity >= 4:
            urgency_level = "SEMI_URGENT"
            urgency_title = "Medical Consultation Recommended (Within 2-3 Days)"
            urgency_color = "#EAB308" # Yellow
            urgency_description = "Moderate symptom presentation. We recommend scheduling an appointment with your healthcare provider within the next few days."
            recommended_actions = [
                "Contact your doctor's office to book an appointment within 48 to 72 hours.",
                "Maintain a symptom journal logging temperature, symptom triggers, and pain scales.",
                "Stay well hydrated and ensure adequate rest."
            ]
        else:
            urgency_level = "SELF_MANAGEMENT"
            urgency_title = "Routine Care & Monitored Self-Care"
            urgency_color = "#10B981" # Emerald
            urgency_description = "Mild symptoms without acute red flags. Can typically be monitored with standard self-care measures, unless symptoms persist or worsen."
            recommended_actions = [
                "Rest, stay hydrated with electrolyte fluids, and avoid strenuous physical exertion.",
                "Over-the-counter supportive relief if recommended by your pharmacist.",
                "If symptoms do not improve after 48-72 hours, schedule a routine medical visit."
            ]

        # Differential Pattern Insights
        symptom_ids = [s["id"] for s in symptom_objs]
        matched_conditions = []

        # Cardiovascular patterns
        if any(sid in symptom_ids for sid in ["chest_pain", "palpitations", "shortness_of_breath_exertion"]):
            matched_conditions.append(PossibleCondition(
                name="Acute Coronary Syndrome / Angina Pectoris",
                probability_band="Elevated Consideration" if "chest_pain" in symptom_ids else "Moderate",
                description="Myocardial ischemia resulting from restricted coronary arterial blood flow. Requires immediate formal ECG and troponin biomarker assays.",
                common_triggers=["Exertion", "Emotional stress", "Cold temperature exposure"],
                critical_flags=["Radiation to jaw/left arm", "Diaphoresis (cold sweats)", "Nausea"]
            ))

        # Heart failure pattern
        if any(sid in symptom_ids for sid in ["shortness_of_breath_exertion", "leg_swelling", "fatigue_severe"]):
            matched_conditions.append(PossibleCondition(
                name="Congestive Heart Failure / Fluid Overload",
                probability_band="Moderate Consideration",
                description="Inability of the heart to pump sufficient blood, resulting in peripheral edema and pulmonary venous congestion.",
                common_triggers=["Excess sodium intake", "Medication non-adherence", "Underlying hypertension"],
                critical_flags=["Orthopnea (cannot breathe lying flat)", "Sudden weight gain (>2 kg in 48h)"]
            ))

        # Respiratory patterns
        if any(sid in symptom_ids for sid in ["severe_dyspnea", "wheezing", "persistent_cough"]):
            matched_conditions.append(PossibleCondition(
                name="Acute Exacerbation of Asthma or COPD / Bronchospasm",
                probability_band="Elevated Consideration" if "severe_dyspnea" in symptom_ids else "Moderate",
                description="Hyperreactive airway obstruction accompanied by mucosal inflammation and expiratory airflow limitation.",
                common_triggers=["Aeroallergens", "Viral respiratory tract infections", "Tobacco smoke"],
                critical_flags=["Cyanosis (bluish lips)", "Use of accessory neck muscles to breathe"]
            ))

        # Neurological / Cerebrovascular pattern
        if any(sid in symptom_ids for sid in ["sudden_weakness", "slurred_speech", "thunderclap_headache"]):
            matched_conditions.append(PossibleCondition(
                name="Acute Cerebrovascular Event (Stroke / TIA) or Hemorrhage",
                probability_band="CRITICAL RED FLAG",
                description="Disruption of cerebral blood flow (ischemic) or vascular rupture (hemorrhagic). 'Time is Brain' — immediate thrombolytic / neurovascular evaluation needed.",
                common_triggers=["Severe uncontrolled hypertension", "Atrial fibrillation", "Carotid stenosis"],
                critical_flags=["Facial droop", "Unilateral arm weakness", "Sudden vision loss"]
            ))

        # Infection pattern
        if any(sid in symptom_ids for sid in ["high_fever", "fever_stiff_neck", "persistent_cough", "sore_throat"]):
            matched_conditions.append(PossibleCondition(
                name="Systemic Respiratory or Infectious Syndrome",
                probability_band="Moderate Consideration",
                description="Immune-mediated response to bacterial or viral pathogens affecting the upper/lower respiratory tract or central nervous system.",
                common_triggers=["Community exposures", "Seasonal viral peaks", "Immunocompromise"],
                critical_flags=["Neck rigidity with photophobia", "Confusion", "Hypotension"]
            ))

        # Fallback if no specific syndrome pattern triggered
        if not matched_conditions:
            matched_conditions.append(PossibleCondition(
                name="Non-Specific Acute Physiological Stress / Viral Prodrome",
                probability_band="Low to Moderate",
                description="Broad constitutional presentation that requires clinical examination and potential blood count/metabolic testing.",
                common_triggers=["Dehydration", "Viral infection", "Physical overexertion"],
                critical_flags=["High unremitting fever", "Severe localized pain"]
            ))

        return SymptomAnalysisResponse(
            urgency_level=urgency_level,
            urgency_title=urgency_title,
            urgency_color=urgency_color,
            urgency_description=urgency_description,
            clinical_acuity_score=acuity_score,
            matched_conditions=matched_conditions,
            red_flags_present=red_flags_present,
            recommended_actions=recommended_actions,
            disclaimer=(
                "LEGAL & CLINICAL DISCLAIMER: MEDPULSE AI is an academic demonstration and decision-support tool. "
                "It does not provide diagnostic conclusions, medical advice, or treatment prescriptions. "
                "Information provided here must never replace an evaluation by a qualified medical professional. "
                "If you are experiencing a medical emergency, immediately call 911 or your local emergency services."
            )
        )

symptom_engine = SymptomEngine()
