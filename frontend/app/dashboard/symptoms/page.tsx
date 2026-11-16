"use client";

import { useState, useEffect } from "react";
import {
  Stethoscope,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  HeartPulse,
  Info
} from "lucide-react";
import { api } from "@/lib/api";

export default function SymptomsPage() {
  const [symptomList, setSymptomList] = useState<any[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["chest_pain", "shortness_of_breath_exertion"]);
  const [age, setAge] = useState<number>(62);
  const [gender, setGender] = useState<string>("Male");
  const [severity, setSeverity] = useState<number>(8);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [comorbidities, setComorbidities] = useState<string[]>(["Hypertension", "Coronary Artery Disease"]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchSymptoms() {
      try {
        const list = await api.getSymptomList();
        setSymptomList(list);
      } catch (e) {
        console.error("Failed to load symptoms list:", e);
      }
    }
    fetchSymptoms();
  }, []);

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const toggleComorbidity = (item: string) => {
    if (comorbidities.includes(item)) {
      setComorbidities(comorbidities.filter((c) => c !== item));
    } else {
      setComorbidities([...comorbidities, item]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom to evaluate.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.analyzeSymptoms({
        age,
        gender,
        symptoms: selectedSymptoms,
        severity,
        duration_days: durationDays,
        pre_existing_conditions: comorbidities,
      });
      setAnalysisResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms.");
    } finally {
      setIsLoading(false);
    }
  };

  // Group symptoms by category
  const categories = Array.from(new Set(symptomList.map((s) => s.category)));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-[#FF4D9D]" />
          AI Clinical Symptom Triage & Triage Acuity
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Rule-based emergency severity index (ESI) demonstration system. Evaluates clinical red flags,
          acuity score (0-100), and recommended urgency tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Demographics */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#262626]">
              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                  Patient Age
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                  Biological Sex
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Severity and Duration */}
            <div className="space-y-4 pb-4 border-b border-[#262626]">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-[#A1A1AA]">Symptom Severity (Scale 1 - 10)</span>
                  <span className="font-mono font-bold text-[#FF4D9D] px-2 py-0.5 rounded bg-[#FF4D9D]/10 border border-[#FF4D9D]/30">
                    Level {severity}/10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-[#FF4D9D] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#71717A] mt-1 font-mono">
                  <span>1 (Mild / Barely Noticeable)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Worst Possible Pain)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                  Symptom Duration (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>
            </div>

            {/* Categorized Symptom Selection */}
            <div className="space-y-3 pb-4 border-b border-[#262626]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Select Reported Symptoms ({selectedSymptoms.length} selected)
                </label>
                <span className="text-[10px] text-[#FF4D9D] font-mono">
                  * Red dot = Red-flag symptom
                </span>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <div key={cat} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#A1A1AA] block uppercase tracking-wider font-mono">
                      {cat}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {symptomList
                        .filter((s) => s.category === cat)
                        .map((s) => {
                          const isSelected = selectedSymptoms.includes(s.id);
                          return (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => toggleSymptom(s.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#FF4D9D] text-white font-medium shadow-glowSubtle"
                                  : "bg-[#101010] text-[#A1A1AA] hover:text-white border border-[#262626] hover:border-[#FF4D9D]/40"
                              }`}
                            >
                              {s.is_red_flag && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                              )}
                              <span>{s.name}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-existing conditions */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1AA] block">
                Pre-existing Comorbidities
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hypertension",
                  "Type 2 Diabetes",
                  "Coronary Artery Disease",
                  "Asthma / COPD",
                  "Chronic Kidney Disease",
                  "Congestive Heart Failure",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleComorbidity(item)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                      comorbidities.includes(item)
                        ? "bg-[#FF4D9D]/20 text-[#FFB6D5] border border-[#FF4D9D]/50"
                        : "bg-[#101010] text-[#71717A] border border-[#262626]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="text-xs text-red-400 p-2.5 bg-red-500/10 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow text-xs disabled:opacity-50"
            >
              {isLoading ? "Running Triage Engine..." : "Analyze Symptoms & Stratify Urgency"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* OUTPUT ANALYSIS RESULTS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {!analysisResult ? (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[400px] text-[#A1A1AA] space-y-3">
              <Stethoscope className="w-12 h-12 text-[#262626]" />
              <h3 className="text-sm font-semibold text-white">Awaiting Clinical Inputs</h3>
              <p className="text-xs max-w-xs leading-relaxed">
                Select patient symptoms and adjust the severity scale on the left to compute clinical urgency
                and view structured differential pattern insights.
              </p>
            </div>
          ) : (
            <div className="glass-card p-6 sm:p-7 space-y-6 border border-[#FF4D9D]/40 shadow-glowSubtle">
              {/* Urgency Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                    Triage Urgency Category
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Score: {analysisResult.clinical_acuity_score}/100
                  </span>
                </div>
                <div
                  className="p-4 rounded-xl border text-left"
                  style={{
                    backgroundColor: `${analysisResult.urgency_color}15`,
                    borderColor: `${analysisResult.urgency_color}50`,
                  }}
                >
                  <div
                    className="font-bold text-sm"
                    style={{ color: analysisResult.urgency_color }}
                  >
                    {analysisResult.urgency_title}
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    {analysisResult.urgency_description}
                  </p>
                </div>
              </div>

              {/* Red flags */}
              {analysisResult.red_flags_present?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Clinical Red Flags Identified:
                  </div>
                  <ul className="text-xs text-red-200 list-disc list-inside space-y-0.5 font-mono">
                    {analysisResult.red_flags_present.map((flag: string, i: number) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Differential Conditions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  Educational Pattern Associations
                </h4>
                <div className="space-y-2.5">
                  {analysisResult.matched_conditions.map((cond: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#101010] rounded-xl border border-[#262626] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{cond.name}</span>
                        <span className="text-[10px] font-mono text-[#FFB6D5] px-1.5 py-0.5 rounded bg-[#151515] border border-[#262626]">
                          {cond.probability_band}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                        {cond.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="space-y-2 pt-2 border-t border-[#262626]">
                <h4 className="text-xs font-semibold text-white">Recommended Clinical Actions:</h4>
                <ul className="text-xs text-[#A1A1AA] space-y-1.5">
                  {analysisResult.recommended_actions.map((act: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="pt-3 border-t border-[#262626] text-[10px] text-[#71717A] leading-relaxed">
                {analysisResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
