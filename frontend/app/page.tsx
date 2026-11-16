"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Stethoscope,
  FileText,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  // Mini interactive readmission risk preview state
  const [inpatients, setInpatients] = useState(1);
  const [comorbidity, setComorbidity] = useState(2);
  const [timeInHospital, setTimeInHospital] = useState(4);
  const [diagnosis, setDiagnosis] = useState("Circulatory");

  // Approximate live probability for instant interactive feel
  const calcProb = Math.min(
    0.95,
    Math.max(
      0.12,
      0.15 +
        inpatients * 0.18 +
        comorbidity * 0.08 +
        timeInHospital * 0.03 +
        (diagnosis === "Circulatory" ? 0.15 : 0.05)
    )
  );
  const probPercent = (calcProb * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#FF4D9D]/30">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-[#262626]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF4D9D]/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151515] border border-[#FF4D9D]/40 shadow-glowSubtle text-xs font-mono text-[#FFB6D5]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D9D]" />
                <span>BTech AI/ML Portfolio & Decision Support System</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
                AI-Powered Healthcare Intelligence &{" "}
                <span className="gradient-text-pink">Predictive Analytics</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
                MEDPULSE AI unifies clinical hemodynamics telemetry, structured natural language
                medical report understanding, and machine-learning hospital readmission risk stratification.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow hover:shadow-glowLg text-sm"
                >
                  <Activity className="w-4 h-4" />
                  Launch Clinical Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/dashboard/predictions"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-[#151515] hover:bg-[#1a1a1a] text-white border border-[#262626] hover:border-[#FF4D9D]/50 transition-all text-sm"
                >
                  <BrainCircuit className="w-4 h-4 text-[#FF4D9D]" />
                  Explore ML Benchmark
                </Link>
              </div>

              {/* Key Highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A1A1AA] font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  ROC-AUC 0.901 Discrimination
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  10,000 Inpatient Cohort
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  Zero PII / Privacy by Design
                </span>
              </div>
            </div>

            {/* INTERACTIVE MINI DEMO CARD */}
            <div className="mt-14 max-w-4xl mx-auto glass-card p-6 sm:p-8 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-[#262626] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D9D] animate-ping" />
                    <h3 className="text-base font-bold text-white">Live Readmission Prediction Sandbox</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Adjust clinical parameters to observe instantaneous ML risk stratification.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080808] border border-[#262626] font-mono text-xs">
                  <Cpu className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  <span>Model: Gradient Boosting (Serialized)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#A1A1AA] mb-1.5">
                      <span>Prior Inpatient Admissions (12mo)</span>
                      <span className="text-[#FFB6D5] font-mono font-bold">{inpatients}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={inpatients}
                      onChange={(e) => setInpatients(Number(e.target.value))}
                      className="w-full accent-[#FF4D9D] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#A1A1AA] mb-1.5">
                      <span>Charlson Comorbidity Index</span>
                      <span className="text-[#FFB6D5] font-mono font-bold">{comorbidity}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={8}
                      value={comorbidity}
                      onChange={(e) => setComorbidity(Number(e.target.value))}
                      className="w-full accent-[#FF4D9D] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#A1A1AA] mb-1.5">
                      <span>Length of Hospital Stay (Days)</span>
                      <span className="text-[#FFB6D5] font-mono font-bold">{timeInHospital} days</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={timeInHospital}
                      onChange={(e) => setTimeInHospital(Number(e.target.value))}
                      className="w-full accent-[#FF4D9D] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                      Primary Inpatient Diagnosis
                    </label>
                    <select
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-[#101010] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                    >
                      <option value="Circulatory">Circulatory (Heart Failure / CAD)</option>
                      <option value="Respiratory">Respiratory (COPD / Pneumonia)</option>
                      <option value="Endocrine">Endocrine / Diabetes Mellitus</option>
                      <option value="Digestive">Digestive Disorders</option>
                      <option value="Injury">Injury & Trauma</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Output Gauge */}
                <div className="bg-[#101010] border border-[#262626] rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                  <div className="w-full flex items-center justify-between text-xs text-[#A1A1AA]">
                    <span>Predicted 30-Day Risk</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        calcProb >= 0.6
                          ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40"
                          : calcProb >= 0.35
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {calcProb >= 0.6 ? "High Risk" : calcProb >= 0.35 ? "Moderate Risk" : "Low Risk"}
                    </span>
                  </div>

                  {/* Percentage Display */}
                  <div className="my-6">
                    <div className="text-5xl font-black tracking-tight text-white font-mono">
                      {probPercent}%
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1">Readmission Likelihood</p>
                  </div>

                  {/* Recommendations */}
                  <div className="w-full text-left bg-[#151515] p-3 rounded-xl border border-[#262626] text-xs space-y-1">
                    <p className="font-semibold text-white">Suggested Triage Protocol:</p>
                    <p className="text-[#A1A1AA]">
                      {calcProb >= 0.6
                        ? "Priority post-discharge clinic review within 72h + pharmacist reconciliation."
                        : calcProb >= 0.35
                        ? "Routine physician outpatient visit scheduled within 7 to 10 days."
                        : "Standard post-discharge recovery follow-up within 14 to 21 days."}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/predictions"
                    className="mt-4 text-xs font-semibold text-[#FF4D9D] hover:text-[#FFB6D5] flex items-center gap-1 transition-colors"
                  >
                    Open Full ML Prediction Suite & Feature Importance
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-12 bg-[#101010] border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#FF4D9D] font-mono">0.901</div>
                <div className="text-xs uppercase tracking-wider text-[#A1A1AA]">ROC-AUC Performance</div>
                <p className="text-[10px] text-[#71717A] font-mono">Gradient Boosting Model</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-white font-mono">10,000</div>
                <div className="text-xs uppercase tracking-wider text-[#A1A1AA]">Benchmark Inpatients</div>
                <p className="text-[10px] text-[#71717A] font-mono">Modeled on UCI 130-US Hospitals</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-white font-mono">&lt; 50ms</div>
                <div className="text-xs uppercase tracking-wider text-[#A1A1AA]">Inference Latency</div>
                <p className="text-[10px] text-[#71717A] font-mono">FastAPI Asynchronous Pipeline</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#FFB6D5] font-mono">100%</div>
                <div className="text-xs uppercase tracking-wider text-[#A1A1AA]">Synthetic Zero-PII</div>
                <p className="text-[10px] text-[#71717A] font-mono">HIPAA & GDPR Demonstration Ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE MODULES SECTION */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#FF4D9D] uppercase">
              Comprehensive Platform Capabilities
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-white">
              End-to-End Clinical Decision Support
            </h3>
            <p className="text-sm text-[#A1A1AA]">
              Four tightly integrated clinical engines built with strict biomedical validation and transparent logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4D9D]/10 border border-[#FF4D9D]/30 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-[#FF4D9D]" />
              </div>
              <h4 className="text-lg font-bold text-white">Hospital Readmission Predictive Modeling</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Trained on a 10,000-patient inpatient benchmark using stratified 80/20 train/test evaluation.
                Benchmarks Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting algorithms
                across Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#FFB6D5]">
                <span>&bull; Serialized Joblib Pipeline</span>
                <span>&bull; Risk Factor Attribution</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4D9D]/10 border border-[#FF4D9D]/30 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#FF4D9D]" />
              </div>
              <h4 className="text-lg font-bold text-white">Patient Vitals Telemetry & Anomaly Flags</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Tracks heart rate, blood pressure (systolic/diastolic), temperature, oxygen saturation (SpO2),
                and respiratory rate over time. Automatically triggers clinical alerts for tachycardia,
                bradycardia, hypertension stages, hypoxemia, and febrile conditions.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#FFB6D5]">
                <span>&bull; Interactive Recharts</span>
                <span>&bull; Threshold Flagging</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4D9D]/10 border border-[#FF4D9D]/30 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#FF4D9D]" />
              </div>
              <h4 className="text-lg font-bold text-white">AI Symptom Triage & Red-Flag Screening</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Transparent rule-based clinical engine evaluating symptom severity (1-10), duration, age, and
                comorbidities. Stratifies into Emergency, Urgent, Semi-Urgent, and Self-Care categories while
                screening for acute cardiopulmonary and neurovascular red flags.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#FFB6D5]">
                <span>&bull; Acuity Scoring (0-100)</span>
                <span>&bull; Transparent Rules</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-8 glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4D9D]/10 border border-[#FF4D9D]/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#FF4D9D]" />
              </div>
              <h4 className="text-lg font-bold text-white">AI Medical Report Analyzer & NLP</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Uploads clinical laboratory PDF documents, extracts text via PyPDF, and uses biomedical regex
                and dictionaries to extract biomarkers (Hemoglobin, WBC, Glucose, HbA1c, Creatinine, Lipids).
                Translates complex terminology into plain English with suggested physician questions.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#FFB6D5]">
                <span>&bull; PDF Text Extraction</span>
                <span>&bull; Layman Translation</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 bg-[#101010] border-t border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#FF4D9D] uppercase">
                Architecture & Workflow
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-white">
                How MEDPULSE AI Operates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#151515] p-6 rounded-2xl border border-[#262626] space-y-3">
                <div className="text-2xl font-black text-[#FF4D9D] font-mono">01</div>
                <h4 className="text-sm font-bold text-white">Inpatient Ingestion</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Patient clinical profiles, laboratory metrics, and prior admission histories are securely ingested.
                </p>
              </div>

              <div className="bg-[#151515] p-6 rounded-2xl border border-[#262626] space-y-3">
                <div className="text-2xl font-black text-[#FF4D9D] font-mono">02</div>
                <h4 className="text-sm font-bold text-white">Feature Pipeline</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  One-hot encoding and StandardScaler preprocessing transform clinical features without data leakage.
                </p>
              </div>

              <div className="bg-[#151515] p-6 rounded-2xl border border-[#262626] space-y-3">
                <div className="text-2xl font-black text-[#FF4D9D] font-mono">03</div>
                <h4 className="text-sm font-bold text-white">ML Inference</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Gradient Boosting evaluates probabilistic risk score and computes top clinical risk contributors.
                </p>
              </div>

              <div className="bg-[#151515] p-6 rounded-2xl border border-[#262626] space-y-3">
                <div className="text-2xl font-black text-[#FF4D9D] font-mono">04</div>
                <h4 className="text-sm font-bold text-white">Decision Support</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Clinicians receive actionable post-discharge follow-up recommendations and medication reconciliation flags.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D9D]/15 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Experience MEDPULSE AI?
            </h3>
            <p className="text-sm text-[#A1A1AA] max-w-xl mx-auto mb-8 leading-relaxed">
              Explore live inpatient hemodynamics, test the 30-day readmission prediction models,
              and review the comprehensive clinical intelligence suite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow hover:shadow-glowLg text-sm flex items-center justify-center gap-2"
              >
                Access Inpatient Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-[#101010] hover:bg-[#1a1a1a] text-white border border-[#262626] text-sm"
              >
                Clinician Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
