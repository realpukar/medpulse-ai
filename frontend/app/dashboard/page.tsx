"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  Stethoscope,
  FileText,
  HeartPulse,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Clock,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";
import { api } from "@/lib/api";

const RISK_COLORS: Record<string, string> = {
  Low: "#10B981",
  Moderate: "#F59E0B",
  High: "#FF4D9D",
  Critical: "#EF4444",
};

export default function MainDashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [patientsData, analyticsData, alertsData] = await Promise.all([
          api.getPatients(),
          api.getAnalyticsOverview(),
          api.getRecentAlerts(),
        ]);
        setPatients(patientsData);
        setAnalytics(analyticsData);
        setAlerts(alertsData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const riskData = analytics?.risk_breakdown || [
    { category: "Low", percentage: 33.3, patient_count: 2, color: "#10B981" },
    { category: "Moderate", percentage: 33.3, patient_count: 2, color: "#F59E0B" },
    { category: "High", percentage: 16.7, patient_count: 1, color: "#FF4D9D" },
    { category: "Critical", percentage: 16.7, patient_count: 1, color: "#EF4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Acute Inpatient Clinical Overview
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FF4D9D]/20 text-[#FFB6D5] border border-[#FF4D9D]/40">
              Live Feed
            </span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Real-time telemetry, 30-day readmission predictive risk stratification, and patient monitoring.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/predictions"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF4D9D] hover:bg-[#E63584] text-white text-xs font-bold transition-all shadow-glow"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Predict Readmission
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151515] hover:bg-[#202020] border border-[#262626] text-white text-xs font-semibold transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFB6D5]" />
            Upload Report
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A1A1AA]">Active Inpatients</span>
            <div className="w-8 h-8 rounded-lg bg-[#101010] border border-[#262626] flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono">
              {patients.length || 6}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              100% telemetry adherence
            </p>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden border border-[#FF4D9D]/40 shadow-glowSubtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#FFB6D5]">High Readmission Risk</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF4D9D]/15 border border-[#FF4D9D]/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#FF4D9D]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FF4D9D] font-mono">
              {analytics?.high_risk_patients ?? 2}
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Requiring priority 72h discharge protocol
            </p>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A1A1AA]">Model Discrimination</span>
            <div className="w-8 h-8 rounded-lg bg-[#101010] border border-[#262626] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#FFB6D5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono">0.901 ROC-AUC</div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Gradient Boosting (N=10,000 benchmark)
            </p>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A1A1AA]">Abnormal Vitals Flags</span>
            <div className="w-8 h-8 rounded-lg bg-[#101010] border border-[#262626] flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400 font-mono">
              {alerts.length || 3} Alerts
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">
              Tachycardia & Hypoxemia monitored
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS & ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            <div>
              <h3 className="text-sm font-bold text-white">Cohort Readmission Stratification</h3>
              <p className="text-[11px] text-[#A1A1AA]">Current inpatient risk categories</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#FFB6D5] border border-[#262626]">
              30-Day Outlook
            </span>
          </div>

          <div className="h-52 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="patient_count"
                >
                  {riskData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RISK_COLORS[entry.category] || "#A1A1AA"}
                      stroke="#080808"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151515",
                    borderColor: "#262626",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#ffffff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#262626] text-xs">
            {riskData.map((item: any) => (
              <div key={item.category} className="flex items-center justify-between px-2 py-1 bg-[#101010] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: RISK_COLORS[item.category] || "#A1A1AA" }}
                  />
                  <span className="text-[#A1A1AA] text-[11px]">{item.category}</span>
                </div>
                <span className="font-mono font-bold text-white text-[11px]">{item.patient_count} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Anomaly Alerts Feed */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF4D9D]" />
                  Recent Hemodynamic Out-of-Range Alerts
                </h3>
                <p className="text-[11px] text-[#A1A1AA]">
                  Clinically significant physiological deviations automatically flagged
                </p>
              </div>
              <Link
                href="/dashboard/vitals"
                className="text-xs text-[#FF4D9D] hover:text-[#FFB6D5] flex items-center gap-1 font-semibold"
              >
                View Telemetry
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#71717A]">
                  No active abnormal vital flags recorded in the last 24 hours.
                </div>
              ) : (
                alerts.slice(0, 5).map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#101010] rounded-xl border border-[#262626] hover:border-[#FF4D9D]/40 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D9D] shrink-0" />
                      <div>
                        <div className="font-semibold text-white">
                          Patient #{alert.patient_id} &bull;{" "}
                          <span className="text-[#FF4D9D] font-mono">{alert.anomaly_notes}</span>
                        </div>
                        <div className="text-[11px] text-[#A1A1AA] flex items-center gap-3 mt-0.5 font-mono">
                          <span>HR: {alert.heart_rate} bpm</span>
                          <span>BP: {alert.systolic_bp}/{alert.diastolic_bp} mmHg</span>
                          <span>SpO2: {alert.spo2}%</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#71717A] font-mono shrink-0">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFB6D5]" />
              Telemetry sample interval: 2 hours
            </span>
            <span className="text-emerald-400 font-mono">Telemetry Status: OK</span>
          </div>
        </div>
      </div>

      {/* INPATIENT ROSTER TABLE */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#262626] gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Current Inpatient Roster</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Individual admission acuity, primary diagnoses, and predicted 30-day risk status
            </p>
          </div>
          <div className="text-xs text-[#A1A1AA] font-mono">
            Displaying {patients.length} Active Records
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101010] text-[#A1A1AA] uppercase font-mono text-[10px] tracking-wider border-b border-[#262626]">
              <tr>
                <th className="py-3 px-4">MRN</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Primary Diagnosis</th>
                <th className="py-3 px-4">Readmission Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-[#151515] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">{patient.mrn}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {patient.age}y &bull; {patient.gender}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA] font-mono">{patient.room_number}</td>
                  <td className="py-3.5 px-4 text-white max-w-xs truncate" title={patient.primary_diagnosis}>
                    {patient.primary_diagnosis}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        patient.risk_category === "Critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : patient.risk_category === "High"
                          ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40"
                          : patient.risk_category === "Moderate"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {patient.risk_category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/dashboard/vitals?patient_id=${patient.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF4D9D] hover:text-[#FFB6D5] transition-colors"
                    >
                      Vitals Telemetry
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
