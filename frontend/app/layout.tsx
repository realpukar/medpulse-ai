import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEDPULSE AI — Healthcare Intelligence & Decision Support",
  description: "Production-grade AI/ML Healthcare Analytics, Patient Vitals Telemetry, and Readmission Predictive Modeling Platform",
  keywords: ["Healthcare AI", "Hospital Readmission Prediction", "Machine Learning", "FastAPI", "Next.js", "Clinical Decision Support"],
  authors: [{ name: "MedPulse AI Engineering" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080808] text-white min-h-screen antialiased selection:bg-[#FF4D9D]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
