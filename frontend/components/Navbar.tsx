"use client";

import Link from "next/link";
import { Activity, ShieldAlert, ArrowRight, BrainCircuit, LineChart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#151515] border border-[#FF4D9D]/30 flex items-center justify-center group-hover:border-[#FF4D9D] transition-colors shadow-glowSubtle">
            <Activity className="w-5 h-5 text-[#FF4D9D] animate-heartbeat" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-white">
              MEDPULSE <span className="text-[#FF4D9D]">AI</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#A1A1AA] -mt-1 font-mono">
              Clinical Intelligence
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1A1AA]">
          <Link href="/#features" className="hover:text-white transition-colors">
            Core Modules
          </Link>
          <Link href="/#ml-architecture" className="hover:text-white transition-colors">
            ML Models
          </Link>
          <Link href="/#telemetry" className="hover:text-white transition-colors">
            Vitals Telemetry
          </Link>
          <Link href="/dashboard/predictions" className="hover:text-[#FFB6D5] transition-colors flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-[#FF4D9D]" />
            Live Model Demo
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-white/90 hover:text-white px-3.5 py-1.5 rounded-lg border border-[#262626] hover:border-[#FF4D9D]/40 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-[#FF4D9D] hover:bg-[#E63584] text-white px-4 py-2 rounded-lg transition-all shadow-glow hover:shadow-glowLg"
          >
            Launch Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
