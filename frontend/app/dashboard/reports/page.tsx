"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  FileCode
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [sampleReports, setSampleReports] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function loadSamples() {
      try {
        const samples = await api.getSampleReports();
        setSampleReports(samples);
      } catch (e) {
        console.error("Failed to load sample reports:", e);
      }
    }
    loadSamples();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10 MB limit.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage("");
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage("Please choose a PDF or TXT medical report file first.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await api.uploadReportPdf(formData);
      setAnalysisResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process medical report file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setErrorMessage("Please paste or type clinical lab report text.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const res = await api.analyzeReportText({
        text: textInput,
        report_name: "Clinical_Lab_Work.txt",
      });
      setAnalysisResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze report text.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample: any) => {
    setTextInput(sample.sample_text);
    setActiveTab("text");
    setErrorMessage("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#FF4D9D]" />
          AI Medical Report Analyzer & Clinical NLP
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Extracts laboratory biomarkers from PDF or textual records, validates against adult reference intervals,
          and translates clinical jargon into layman understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6">
            {/* Tabs */}
            <div className="flex rounded-xl bg-[#101010] p-1 border border-[#262626] mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "upload"
                    ? "bg-[#151515] text-white border border-[#FF4D9D]/30 shadow-glowSubtle"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                Upload PDF / TXT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "text"
                    ? "bg-[#151515] text-white border border-[#FF4D9D]/30 shadow-glowSubtle"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                Paste Report Text
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-300 rounded-xl">
                {errorMessage}
              </div>
            )}

            {activeTab === "upload" ? (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#262626] hover:border-[#FF4D9D]/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#101010]/60 hover:bg-[#101010]"
                >
                  <UploadCloud className="w-10 h-10 text-[#FF4D9D] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">
                    {selectedFile ? selectedFile.name : "Click to select or drag PDF report"}
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] mt-1 font-mono">
                    Supported: PDF, TXT (Maximum size 10 MB)
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleUploadSubmit}
                  className="w-full py-2.5 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow text-xs disabled:opacity-50"
                >
                  {isProcessing ? "Extracting & Analyzing..." : "Process Uploaded Report"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={9}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste laboratory results here, e.g.&#10;Fasting Blood Glucose: 138 mg/dL&#10;HbA1c: 7.2%&#10;Serum Creatinine: 1.1 mg/dL&#10;Total Cholesterol: 224 mg/dL..."
                  className="w-full bg-[#101010] border border-[#262626] rounded-xl p-3 text-xs text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#FF4D9D] font-mono leading-relaxed"
                />

                <button
                  type="button"
                  disabled={!textInput.trim() || isProcessing}
                  onClick={handleTextSubmit}
                  className="w-full py-2.5 rounded-xl font-bold bg-[#FF4D9D] hover:bg-[#E63584] text-white transition-all shadow-glow text-xs disabled:opacity-50"
                >
                  {isProcessing ? "Parsing Text..." : "Extract Biomarkers & Translate"}
                </button>
              </div>
            )}
          </div>

          {/* 1-Click Sample Reports */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                1-Click Demonstration Clinical Reports
              </h3>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              Test the extraction and translation engine instantly without needing a local file:
            </p>

            <div className="space-y-2">
              {sampleReports.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className="w-full p-2.5 rounded-xl bg-[#101010] hover:bg-[#151515] border border-[#262626] hover:border-[#FF4D9D]/40 text-left transition-all"
                >
                  <p className="text-xs font-semibold text-[#FFB6D5]">{s.title}</p>
                  <p className="text-[10px] text-[#A1A1AA] mt-0.5 line-clamp-1">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS PANEL (7 Cols) */}
        <div className="lg:col-span-7">
          {!analysisResult ? (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[420px] text-[#A1A1AA] space-y-3">
              <FileCheck className="w-12 h-12 text-[#262626]" />
              <h3 className="text-sm font-semibold text-white">No Report Processed Yet</h3>
              <p className="text-xs max-w-sm leading-relaxed">
                Upload a laboratory report or load one of the 1-click sample panels on the left to extract
                measurements, translate complex medical terminology, and generate physician discussion points.
              </p>
            </div>
          ) : (
            <div className="glass-card p-6 sm:p-7 space-y-6">
              {/* Header & Overall Risk */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#262626] gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    {analysisResult.filename}
                  </h3>
                  <p className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">
                    Extracted {analysisResult.extracted_character_count} characters &bull;{" "}
                    {analysisResult.biomarkers_detected.length} biomarkers identified
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase font-mono ${
                    analysisResult.overall_health_risk.includes("Attention")
                      ? "bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40"
                      : analysisResult.overall_health_risk.includes("Moderate")
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
                >
                  {analysisResult.overall_health_risk}
                </span>
              </div>

              {/* Layman Summary */}
              <div className="p-4 rounded-xl bg-[#101010] border border-[#262626] space-y-1.5">
                <span className="text-xs font-bold text-[#FFB6D5] uppercase font-mono tracking-wider">
                  Plain-English Interpretation Summary
                </span>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {analysisResult.layman_summary}
                </p>
              </div>

              {/* Extracted Biomarkers Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Extracted Biomarker Measurements
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#101010] text-[#A1A1AA] uppercase font-mono text-[10px] tracking-wider border-b border-[#262626]">
                      <tr>
                        <th className="py-2.5 px-3">Measurement</th>
                        <th className="py-2.5 px-3">Result</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Clinical Context</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {analysisResult.biomarkers_detected.map((bio: any, i: number) => (
                        <tr key={i} className="hover:bg-[#101010]">
                          <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                            {bio.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                            {bio.value} <span className="text-[10px] text-[#A1A1AA]">{bio.unit}</span>
                          </td>
                          <td className="py-2.5 px-3 text-[#A1A1AA] font-mono whitespace-nowrap">
                            {bio.reference_range}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                bio.status === "ELEVATED"
                                  ? "bg-[#FF4D9D]/20 text-[#FF4D9D]"
                                  : bio.status === "LOW"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-400"
                              }`}
                            >
                              {bio.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#A1A1AA] text-[11px] leading-tight min-w-[180px]">
                            {bio.clinical_meaning}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Medical Term Translations */}
              {analysisResult.medical_terms_translated?.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#262626]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Medical Terminology Translated
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysisResult.medical_terms_translated.map((term: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#101010] border border-[#262626] text-xs">
                        <div className="font-semibold text-[#FFB6D5]">{term.term}</div>
                        <div className="text-white font-medium mt-0.5">{term.plain_english}</div>
                        <div className="text-[10px] text-[#A1A1AA] mt-0.5">{term.context_note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Physician Questions */}
              <div className="space-y-2 pt-2 border-t border-[#262626]">
                <h4 className="text-xs font-semibold text-white">Suggested Questions for Your Physician:</h4>
                <ul className="text-xs text-[#A1A1AA] space-y-1.5">
                  {analysisResult.suggested_physician_questions.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#FF4D9D] shrink-0 mt-0.5" />
                      <span>{q}</span>
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
