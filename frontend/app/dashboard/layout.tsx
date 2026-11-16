"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Activity, Bell, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Dr. Alistair Sharma");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medpulse_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.full_name) setUserName(u.full_name);
        } catch {}
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-[#262626] bg-[#080808]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151515] border border-[#262626] text-xs text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inpatient Acute Telemetry Active</span>
            </div>
            <span className="text-xs text-[#71717A] hidden sm:inline">&bull;</span>
            <span className="text-xs text-[#A1A1AA] font-mono hidden sm:inline">
              ICU Wing B &bull; St. Jude Medical Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/predictions"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4D9D]/10 hover:bg-[#FF4D9D]/20 border border-[#FF4D9D]/30 text-xs font-semibold text-[#FFB6D5] transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-[#FF4D9D]" />
              Run 30-Day ML Inference
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[#262626]">
              <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#FF4D9D]/40 flex items-center justify-center text-xs font-bold text-[#FF4D9D]">
                {userName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">{userName}</p>
                <p className="text-[10px] text-[#A1A1AA] leading-tight font-mono">Attending Staff</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
