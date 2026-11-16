import Link from "next/link";
import { Activity, Github, ShieldAlert, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101010] border-t border-[#262626] text-[#A1A1AA] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#151515] border border-[#FF4D9D]/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#FF4D9D]" />
              </div>
              <span className="font-bold text-lg text-white">
                MEDPULSE <span className="text-[#FF4D9D]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-md">
              A comprehensive healthcare analytics, hemodynamics monitoring, and 30-day hospital
              readmission risk modeling platform designed for clinical decision support and academic research.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/realpukar/medpulse-ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-white/80 hover:text-[#FF4D9D] transition-colors border border-[#262626] px-3 py-1.5 rounded-lg bg-[#151515]"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
                <ExternalLink className="w-3 h-3 text-[#A1A1AA]" />
              </a>
              <span className="text-xs px-2.5 py-1 bg-[#151515] border border-[#262626] rounded-md font-mono text-[#FFB6D5]">
                v1.0.0 Production
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Clinical Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/predictions" className="hover:text-white transition-colors">Readmission Modeling (ML)</Link>
              </li>
              <li>
                <Link href="/dashboard/symptoms" className="hover:text-white transition-colors">AI Symptom Triage</Link>
              </li>
              <li>
                <Link href="/dashboard/vitals" className="hover:text-white transition-colors">Vitals Telemetry</Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="hover:text-white transition-colors">Medical Report NLP</Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-white transition-colors">Population Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">Engineering Stack</h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex items-center justify-between text-[#A1A1AA]">
                <span>Frontend:</span>
                <span className="text-white">Next.js 14 / TS</span>
              </li>
              <li className="flex items-center justify-between text-[#A1A1AA]">
                <span>Backend:</span>
                <span className="text-white">FastAPI Python 3</span>
              </li>
              <li className="flex items-center justify-between text-[#A1A1AA]">
                <span>ML Pipeline:</span>
                <span className="text-white">Scikit-Learn / Joblib</span>
              </li>
              <li className="flex items-center justify-between text-[#A1A1AA]">
                <span>Database:</span>
                <span className="text-white">SQLAlchemy / SQLite</span>
              </li>
              <li className="flex items-center justify-between text-[#A1A1AA]">
                <span>Aesthetic:</span>
                <span className="text-[#FF4D9D]">#080808 & #FF4D9D</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="border border-[#FF4D9D]/20 bg-[#151515]/60 rounded-xl p-4 flex items-start gap-3 mb-8">
          <ShieldAlert className="w-5 h-5 text-[#FF4D9D] shrink-0 mt-0.5" />
          <div className="text-xs text-[#A1A1AA] leading-relaxed">
            <strong className="text-white font-medium">Important Clinical & Academic Notice:</strong> MEDPULSE AI is an
            artificial intelligence demonstration and decision-support system. It does not replace clinical judgment, diagnostic
            evaluations, or professional medical advice from licensed physicians. In life-threatening emergencies, immediately call
            emergency services (911/112).
          </div>
        </div>

        <div className="border-t border-[#262626] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div>
            &copy; {new Date().getFullYear()} MEDPULSE AI. Built with precision and care.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-white font-medium">Gradient Boosting & Next.js</span>
            <Heart className="w-3.5 h-3.5 text-[#FF4D9D] ml-1 fill-[#FF4D9D]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
