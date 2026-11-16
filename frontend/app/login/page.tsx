"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await api.login({ email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("medpulse_token", data.access_token);
        localStorage.setItem("medpulse_user", JSON.stringify(data.user));
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF4D9D]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-[#FF4D9D]/30 flex items-center justify-center shadow-glowSubtle">
              <Activity className="w-5 h-5 text-[#FF4D9D] animate-heartbeat" />
            </div>
            <span className="font-bold text-xl text-white">
              MEDPULSE <span className="text-[#FF4D9D]">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Clinician Portal Sign In</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Access secure inpatient records, vitals telemetry, and predictive modeling.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinician@medpulse.ai"
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#FF4D9D] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#A1A1AA]">Password</label>
                <span className="text-[11px] text-[#FFB6D5] hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#FF4D9D] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow text-xs disabled:opacity-50"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#262626]">
            <p className="text-[11px] text-[#A1A1AA] text-center mb-2 font-mono uppercase tracking-wider">
              1-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("clinician@medpulse.ai", "Medpulse@2026")}
                className="py-2 px-2.5 rounded-lg bg-[#101010] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#FF4D9D]/40 text-[11px] text-white transition-all text-center"
              >
                <span className="font-semibold block text-[#FFB6D5]">Dr. Sharma</span>
                <span className="text-[10px] text-[#A1A1AA]">Clinician Role</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("patient@medpulse.ai", "Medpulse@2026")}
                className="py-2 px-2.5 rounded-lg bg-[#101010] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#FF4D9D]/40 text-[11px] text-white transition-all text-center"
              >
                <span className="font-semibold block text-emerald-300">Eleanor Ross</span>
                <span className="text-[10px] text-[#A1A1AA]">Patient Role</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#A1A1AA] mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#FF4D9D] hover:text-[#FFB6D5] font-semibold">
            Create clinician account
          </Link>
        </p>
      </div>
    </div>
  );
}
