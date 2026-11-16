"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Mail,
  Shield,
  Key,
  LogOut,
  Clock,
  Activity,
  FileText,
  BrainCircuit,
  CheckCircle2,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    full_name: "Dr. Alistair Sharma, MD",
    email: "clinician@medpulse.ai",
    role: "clinician",
    is_active: true,
  });
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medpulse_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
    }

    async function loadPatients() {
      try {
        const pts = await api.getPatients();
        setPatients(pts);
      } catch (err) {
        console.error("Profile patient load error:", err);
      }
    }
    loadPatients();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("medpulse_token");
      localStorage.removeItem("medpulse_user");
    }
    router.push("/login");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[#FF4D9D]" />
          Clinician Profile & Account Settings
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Identity management, institutional role assignments, and session security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card (1 Col) */}
        <div className="glass-card p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#FF4D9D]/15 border border-[#FF4D9D]/40 flex items-center justify-center mx-auto text-2xl font-bold text-[#FF4D9D] shadow-glow">
            {user.full_name?.charAt(0) || "D"}
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{user.full_name}</h2>
            <p className="text-xs text-[#FFB6D5] font-mono mt-0.5 uppercase tracking-wider">
              {user.role} &bull; Attending Staff
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">{user.email}</p>
          </div>

          <div className="pt-3 border-t border-[#262626] space-y-2 text-xs">
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Department:</span>
              <span className="text-white">Acute Inpatient Medicine</span>
            </div>
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Hospital:</span>
              <span className="text-white">St. Jude Medical Center</span>
            </div>
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Status:</span>
              <span className="text-emerald-400 font-mono">Active Verified</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#101010] hover:bg-[#1a1a1a] border border-[#262626] hover:border-red-500/50 text-red-400 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of MedPulse
          </button>
        </div>

        {/* Assigned Inpatient Cohort (2 Cols) */}
        <div className="md:col-span-2 glass-card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Assigned Inpatient Cohort</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Patients currently under direct clinical surveillance
            </p>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {patients.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-[#101010] rounded-xl border border-[#262626] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {p.first_name} {p.last_name}
                    <span className="text-[10px] text-[#A1A1AA] font-mono">({p.mrn})</span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] mt-0.5">
                    Room {p.room_number} &bull; {p.primary_diagnosis}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    p.risk_category === "Critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : p.risk_category === "High"
                      ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {p.risk_category} Risk
                </span>
              </div>
            ))}
          </div>

          {/* Activity History */}
          <div className="pt-4 border-t border-[#262626] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Recent Clinical Platform Activity
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#101010] rounded-lg border border-[#262626] flex items-center justify-between">
                <span className="flex items-center gap-2 text-white">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#FF4D9D]" />
                  Executed 30-Day Readmission Risk Inference (High Risk flagged: 78.4%)
                </span>
                <span className="text-[10px] text-[#71717A] font-mono">10m ago</span>
              </div>
              <div className="p-2.5 bg-[#101010] rounded-lg border border-[#262626] flex items-center justify-between">
                <span className="flex items-center gap-2 text-white">
                  <Activity className="w-3.5 h-3.5 text-[#FFB6D5]" />
                  Logged Bedside Hemodynamic Telemetry for Eleanor Ross
                </span>
                <span className="text-[10px] text-[#71717A] font-mono">45m ago</span>
              </div>
              <div className="p-2.5 bg-[#101010] rounded-lg border border-[#262626] flex items-center justify-between">
                <span className="flex items-center gap-2 text-white">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Processed PDF Diagnostic Report: Admission_Cardiopulmonary_Panel_ER.pdf
                </span>
                <span className="text-[10px] text-[#71717A] font-mono">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
