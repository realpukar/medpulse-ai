/**
 * MEDPULSE AI — Frontend API Client
 * Connects to the FastAPI backend with automatic Bearer token injection.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medpulse_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMessage = "An error occurred with the request.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = `Server responded with status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => request<any>("/auth/me"),

  // Patients
  getPatients: (params?: { risk_category?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/patients${query ? `?${query}` : ""}`);
  },
  getPatient: (id: number) => request<any>(`/patients/${id}`),
  createPatient: (data: any) => request<any>("/patients", { method: "POST", body: JSON.stringify(data) }),

  // Vitals
  recordVitals: (data: any) => request<any>("/vitals", { method: "POST", body: JSON.stringify(data) }),
  getPatientTelemetry: (patientId: number) => request<any>(`/vitals/patient/${patientId}`),
  getRecentAlerts: () => request<any>("/vitals/alerts"),

  // Symptoms
  getSymptomList: () => request<any[]>("/symptoms/list"),
  analyzeSymptoms: (data: any) => request<any>("/symptoms/analyze", { method: "POST", body: JSON.stringify(data) }),

  // Reports
  uploadReportPdf: async (formData: FormData) => {
    const tokenHeader = getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: "POST",
      headers: { ...tokenHeader },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Failed to upload report");
    }
    return response.json();
  },
  analyzeReportText: (data: { text: string; patient_id?: number; report_name?: string }) =>
    request<any>("/reports/analyze-text", { method: "POST", body: JSON.stringify(data) }),
  getSampleReports: () => request<any[]>("/reports/samples"),

  // Predictions (ML)
  predictReadmission: (data: any) =>
    request<any>("/predictions/readmission", { method: "POST", body: JSON.stringify(data) }),
  getModelBenchmarks: () => request<any>("/predictions/benchmarks"),

  // Analytics
  getAnalyticsOverview: () => request<any>("/analytics/overview"),
  exportAnalytics: () => request<any>("/analytics/export"),
};
