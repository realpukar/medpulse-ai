"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  FileText,
  BrainCircuit,
  BarChart3,
  UserCheck,
  LogOut,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Clinical Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "AI Symptom Analyzer",
    href: "/dashboard/symptoms",
    icon: Stethoscope,
    badge: "Triage",
  },
  {
    name: "Vitals Telemetry",
    href: "/dashboard/vitals",
    icon: Activity,
    badge: "Live",
  },
  {
    name: "Medical Report NLP",
    href: "/dashboard/reports",
    icon: FileText,
    badge: null,
  },
  {
    name: "Readmission Prediction",
    href: "/dashboard/predictions",
    icon: BrainCircuit,
    badge: "ML",
  },
  {
    name: "Population Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Clinician Profile",
    href: "/dashboard/profile",
    icon: UserCheck,
    badge: null,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("medpulse_token");
      localStorage.removeItem("medpulse_user");
    }
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#101010] border-r border-[#262626] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-40">
      <div>
        {/* Brand */}
        <div className="h-16 px-5 border-b border-[#262626] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151515] border border-[#FF4D9D]/30 flex items-center justify-center shadow-glowSubtle">
              <HeartPulse className="w-4 h-4 text-[#FF4D9D] animate-heartbeat" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wider text-white">
                MEDPULSE <span className="text-[#FF4D9D]">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-mono">
                Inpatient Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold tracking-wider uppercase text-[#71717A]">
            Main Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#151515] text-white border border-[#FF4D9D]/40 shadow-glowSubtle font-semibold"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#151515]/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#FF4D9D]" : "text-[#A1A1AA] group-hover:text-white"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      item.badge === "ML"
                        ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/30"
                        : "bg-[#262626] text-[#A1A1AA]"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FF4D9D]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-[#262626] space-y-2">
        <div className="bg-[#151515] rounded-xl p-2.5 border border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#FF4D9D]/10 border border-[#FF4D9D]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF4D9D]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">Dr. A. Sharma</p>
              <p className="text-[10px] text-[#A1A1AA] truncate font-mono">Attending Clinician</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Session" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#A1A1AA] hover:text-[#FF4D9D] hover:bg-[#151515] rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
