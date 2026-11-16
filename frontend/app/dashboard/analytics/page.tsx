"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Users,
  Activity,
  Heart,
  TrendingUp,
  Filter,
  PieChart as PieIcon,
  Layers,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from "recharts";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [exportNotice, setExportNotice] = useState<boolean>(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getAnalyticsOverview();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics overview:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleExport = async () => {
    try {
      const exportData = await api.exportAnalytics();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medpulse_analytics_report_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    } catch (e) {
      console.error("Export error:", e);
    }
  };

  const trendData = (data?.recent_trend_dates || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map(
    (day: string, idx: number) => ({
      day,
      readmissions: data?.recent_trend_readmissions?.[idx] ?? 12,
    })
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#FF4D9D]" />
            Healthcare Population Analytics & Demographics
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Inpatient cohort distributions, comorbidity stratifications, and longitudinal utilization trends.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#202020] border border-[#262626] hover:border-[#FF4D9D]/50 text-white text-xs font-semibold transition-all shadow-glowSubtle"
        >
          <Download className="w-4 h-4 text-[#FF4D9D]" />
          {exportNotice ? "Downloaded Report JSON" : "Export Analytical Report"}
        </button>
      </div>

      {/* KEY POPULATION METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data?.key_metrics || []).map((m: any, idx: number) => (
          <div key={idx} className="glass-card p-5">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>{m.title}</span>
              <span
                className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  m.is_positive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#FF4D9D]/15 text-[#FFB6D5] border border-[#FF4D9D]/30"
                }`}
              >
                {m.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-3">{m.value}</div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">{m.description}</p>
          </div>
        ))}
      </div>

      {/* CHARTS GRID: AGE DISTRIBUTION & DIAGNOSIS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age group distribution chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            <div>
              <h3 className="text-sm font-bold text-white">Age Bracket Patient Distribution</h3>
              <p className="text-[11px] text-[#A1A1AA]">Patient counts across age cohorts</p>
            </div>
            <span className="text-[10px] font-mono text-[#FFB6D5] bg-[#101010] px-2 py-0.5 rounded border border-[#262626]">
              Demographics
            </span>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.age_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="age_group" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151515", borderColor: "#262626", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="count" fill="#FF4D9D" radius={[4, 4, 0, 0]} name="Inpatient Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Readmission Trends Line Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Readmission Monitoring Trend</h3>
              <p className="text-[11px] text-[#A1A1AA]">Longitudinal 7-day inpatient readmission frequency</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-[#101010] px-2 py-0.5 rounded border border-[#262626]">
              Historical Trend
            </span>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151515", borderColor: "#262626", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Line
                  type="monotone"
                  dataKey="readmissions"
                  stroke="#FF4D9D"
                  strokeWidth={2.5}
                  dot={{ fill: "#FF4D9D", r: 4 }}
                  activeDot={{ r: 6, fill: "#FFB6D5" }}
                  name="Unplanned Readmissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* POPULATION VITALS AVERAGES */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-white mb-1">
          Inpatient Cohort Hemodynamic Baselines
        </h3>
        <p className="text-xs text-[#A1A1AA] mb-4">
          Mean values across all inpatient continuous monitoring sessions
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-[#101010] p-4 rounded-xl border border-[#262626]">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">Mean Heart Rate</span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              {data?.vitals_averages?.avg_heart_rate ?? 84.2} <span className="text-xs text-[#A1A1AA]">bpm</span>
            </span>
          </div>
          <div className="bg-[#101010] p-4 rounded-xl border border-[#262626]">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">Mean Blood Pressure</span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              {data?.vitals_averages?.avg_systolic_bp ?? 132}/{data?.vitals_averages?.avg_diastolic_bp ?? 84}{" "}
              <span className="text-xs text-[#A1A1AA]">mmHg</span>
            </span>
          </div>
          <div className="bg-[#101010] p-4 rounded-xl border border-[#262626]">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">Mean Temperature</span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              {data?.vitals_averages?.avg_temperature ?? 37.1} <span className="text-xs text-[#A1A1AA]">°C</span>
            </span>
          </div>
          <div className="bg-[#101010] p-4 rounded-xl border border-[#262626]">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">Mean Oxygen SpO2</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
              {data?.vitals_averages?.avg_spo2 ?? 96.4}%
            </span>
          </div>
          <div className="bg-[#101010] p-4 rounded-xl border border-[#262626]">
            <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block">Out-of-Range Flags</span>
            <span className="text-xl font-bold text-[#FF4D9D] font-mono mt-1 block">
              {data?.vitals_averages?.abnormal_vitals_count ?? 14}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
