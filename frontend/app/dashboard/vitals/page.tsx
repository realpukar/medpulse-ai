"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Droplets
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { api } from "@/lib/api";

function VitalsContent() {
  const searchParams = useSearchParams();
  const initialPatientId = Number(searchParams?.get("patient_id")) || 1;

  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number>(initialPatientId);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [activeMetric, setActiveMetric] = useState<string>("heart_rate");

  // Form state
  const [heartRate, setHeartRate] = useState<number>(78);
  const [systolicBp, setSystolicBp] = useState<number>(124);
  const [diastolicBp, setDiastolicBp] = useState<number>(82);
  const [temperature, setTemperature] = useState<number>(37.0);
  const [spo2, setSpo2] = useState<number>(97.5);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(16);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<any>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        const pts = await api.getPatients();
        setPatients(pts);
      } catch (err) {
        console.error("Failed to load patients:", err);
      }
    }
    loadPatients();
  }, []);

  const loadTelemetry = async (pid: number) => {
    try {
      const data = await api.getPatientTelemetry(pid);
      setTelemetry(data);
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      loadTelemetry(selectedPatientId);
    }
  }, [selectedPatientId]);

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const res = await api.recordVitals({
        patient_id: selectedPatientId,
        heart_rate: heartRate,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        temperature,
        spo2,
        respiratory_rate: respiratoryRate,
      });
      setSubmitFeedback({
        success: true,
        is_abnormal: res.is_abnormal,
        notes: res.anomaly_notes,
      });
      loadTelemetry(selectedPatientId);
    } catch (err: any) {
      setSubmitFeedback({
        success: false,
        error: err.message || "Failed to record vitals entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const chartData = (telemetry?.historical || []).map((h: any) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    heart_rate: h.heart_rate,
    systolic_bp: h.systolic_bp,
    diastolic_bp: h.diastolic_bp,
    temperature: h.temperature,
    spo2: h.spo2,
    respiratory_rate: h.respiratory_rate,
    is_abnormal: h.is_abnormal,
  }));

  const metricConfigs: Record<string, { label: string; unit: string; color: string; normalRef: number; normalMax?: number }> = {
    heart_rate: { label: "Heart Rate", unit: "bpm", color: "#FF4D9D", normalRef: 100 },
    systolic_bp: { label: "Systolic Blood Pressure", unit: "mmHg", color: "#FFB6D5", normalRef: 140 },
    diastolic_bp: { label: "Diastolic Blood Pressure", unit: "mmHg", color: "#F59E0B", normalRef: 90 },
    temperature: { label: "Body Temperature", unit: "°C", color: "#EF4444", normalRef: 38.0 },
    spo2: { label: "Oxygen Saturation (SpO2)", unit: "%", color: "#10B981", normalRef: 95.0 },
    respiratory_rate: { label: "Respiratory Rate", unit: "breaths/min", color: "#3B82F6", normalRef: 24.0 },
  };

  const currentMetric = metricConfigs[activeMetric];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header & Patient Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#FF4D9D]" />
            Hemodynamic Vitals Monitoring & Telemetry
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Manual and simulated telemetry monitoring. Automated anomaly alerts and longitudinal trend tracking.
          </p>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-2 bg-[#151515] border border-[#262626] rounded-xl px-3 py-1.5">
          <span className="text-xs text-[#A1A1AA] font-medium">Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#151515] text-white">
                {p.first_name} {p.last_name} ({p.mrn}) - {p.risk_category} Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Patient Banner */}
      {selectedPatient && (
        <div className="glass-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D9D]/15 border border-[#FF4D9D]/30 flex items-center justify-center font-bold text-[#FF4D9D]">
              {selectedPatient.first_name[0]}
              {selectedPatient.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </span>
                <span className="text-[#A1A1AA] font-mono">({selectedPatient.mrn})</span>
              </div>
              <p className="text-[#A1A1AA] mt-0.5">
                {selectedPatient.age}y &bull; {selectedPatient.gender} &bull; Room: {selectedPatient.room_number} &bull;{" "}
                <span className="text-white">{selectedPatient.primary_diagnosis}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase font-mono ${
                selectedPatient.risk_category === "Critical"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : selectedPatient.risk_category === "High"
                  ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}
            >
              {selectedPatient.risk_category} Risk
            </span>
            <div className="text-right text-[11px] text-[#A1A1AA] font-mono">
              <div>Attending: {selectedPatient.attending_physician}</div>
              <div className="text-emerald-400">Telemetry Active</div>
            </div>
          </div>
        </div>
      )}

      {/* LATEST METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "heart_rate", label: "Heart Rate", val: telemetry?.latest?.heart_rate ?? "--", unit: "bpm", icon: Heart },
          { key: "systolic_bp", label: "Systolic BP", val: telemetry?.latest?.systolic_bp ?? "--", unit: "mmHg", icon: Activity },
          { key: "diastolic_bp", label: "Diastolic BP", val: telemetry?.latest?.diastolic_bp ?? "--", unit: "mmHg", icon: Activity },
          { key: "temperature", label: "Temperature", val: telemetry?.latest?.temperature ?? "--", unit: "°C", icon: Thermometer },
          { key: "spo2", label: "SpO2 Oxygen", val: telemetry?.latest?.spo2 ?? "--", unit: "%", icon: Droplets },
          { key: "respiratory_rate", label: "Resp Rate", val: telemetry?.latest?.respiratory_rate ?? "--", unit: "/min", icon: Wind },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveMetric(item.key)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeMetric === item.key
                ? "bg-[#151515] border-[#FF4D9D] shadow-glowSubtle"
                : "bg-[#101010] border-[#262626] hover:border-[#FF4D9D]/40"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
              <span>{item.label}</span>
              <item.icon className="w-3.5 h-3.5 text-[#FFB6D5]" />
            </div>
            <div className="text-lg font-bold text-white mt-1 font-mono">
              {item.val}{" "}
              <span className="text-[10px] font-normal text-[#A1A1AA]">{item.unit}</span>
            </div>
          </button>
        ))}
      </div>

      {/* INTERACTIVE TELEMETRY CHART */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#262626] gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentMetric.color }} />
              24-Hour Telemetry Trend: {currentMetric.label} ({currentMetric.unit})
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">
              Dashed horizontal line indicates abnormal clinical threshold reference
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">
            Total historical datapoints: {chartData.length}
          </div>
        </div>

        <div className="h-64 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="time" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151515",
                  borderColor: "#262626",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#ffffff" }}
              />
              <ReferenceLine
                y={currentMetric.normalRef}
                stroke="#FF4D9D"
                strokeDasharray="4 4"
                label={{ value: "Threshold", fill: "#FFB6D5", fontSize: 10, position: "top" }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={currentMetric.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#metricGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DATA ENTRY FORM & HISTORICAL LOGS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Vitals Entry Form (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <PlusCircle className="w-4 h-4 text-[#FF4D9D]" />
            Log Inpatient Vitals Entry
          </h3>
          <p className="text-[11px] text-[#A1A1AA] mb-4">
            Record manual bedside measurement. Automatic abnormality assessment is performed on save.
          </p>

          {submitFeedback && (
            <div
              className={`p-3 rounded-xl mb-4 text-xs ${
                submitFeedback.success
                  ? submitFeedback.is_abnormal
                    ? "bg-amber-500/15 border border-amber-500/40 text-amber-200"
                    : "bg-emerald-500/15 border border-emerald-500/40 text-emerald-200"
                  : "bg-red-500/15 border border-red-500/40 text-red-200"
              }`}
            >
              {submitFeedback.success ? (
                submitFeedback.is_abnormal ? (
                  <div>
                    <strong>Abnormality Flagged:</strong> {submitFeedback.notes}
                  </div>
                ) : (
                  <div>Vitals recorded successfully. All metrics within standard range.</div>
                )
              ) : (
                submitFeedback.error
              )}
            </div>
          )}

          <form onSubmit={handleRecordVitals} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  required
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Oxygen SpO2 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Systolic BP (mmHg)
                </label>
                <input
                  type="number"
                  required
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Diastolic BP (mmHg)
                </label>
                <input
                  type="number"
                  required
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#A1A1AA] block mb-1">
                  Resp Rate (/min)
                </label>
                <input
                  type="number"
                  required
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D9D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow text-xs disabled:opacity-50"
            >
              {isSubmitting ? "Recording Vitals..." : "Log Inpatient Measurement"}
            </button>
          </form>
        </div>

        {/* Historical Logs List (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-3">
            <h3 className="text-sm font-bold text-white">Historical Telemetry Stream</h3>
            <span className="text-[11px] text-[#A1A1AA] font-mono">
              Abnormal Flags: {telemetry?.abnormal_count ?? 0}
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {(telemetry?.historical || []).slice().reverse().map((rec: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-[#101010] rounded-xl border border-[#262626] text-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      HR: {rec.heart_rate} bpm &bull; BP: {rec.systolic_bp}/{rec.diastolic_bp} mmHg
                    </span>
                    {rec.is_abnormal && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase font-mono">
                        Flagged
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">
                    Temp: {rec.temperature}°C &bull; SpO2: {rec.spo2}% &bull; RR: {rec.respiratory_rate}/min
                  </div>
                  {rec.anomaly_notes && (
                    <div className="text-[10px] text-[#FF4D9D] font-mono mt-1">
                      {rec.anomaly_notes}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[#71717A] font-mono shrink-0">
                  {new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="glass-card p-8 text-center text-xs text-[#A1A1AA]">
          Loading telemetry monitor...
        </div>
      }
    >
      <VitalsContent />
    </Suspense>
  );
}
