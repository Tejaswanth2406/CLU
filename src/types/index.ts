// ============================================================
// CLU — Core Domain Types
// ============================================================

export type Severity = "danger" | "warning" | "info" | "good";
export type RiskLevel = "low" | "medium" | "high";
export type DocumentType =
  | "Terms of Service"
  | "Privacy Policy"
  | "License Agreement"
  | "EULA"
  | "Cookie Policy"
  | "Data Processing Agreement"
  | "Unknown";

export type DocumentTypeInput = "auto" | "tos" | "privacy" | "license" | "eula";

// ─── Finding ──────────────────────────────────────────────────────────────────

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  tag: string;
  icon: string;
  explanation: string;
  quote: string;
}

// ─── Analysis Result ──────────────────────────────────────────────────────────

export interface AnalysisResult {
  id: string;
  docType: DocumentType;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  summary: string;
  dangerCount: number;
  warningCount: number;
  infoCount: number;
  goodCount: number;
  findings: Finding[];
  analyzedAt: string; // ISO date string
  documentPreview: string; // first 200 chars of input
  inputLength: number; // character count of original input
}

// ─── Raw API Response ────────────────────────────────────────────────────────

export interface RawFinding {
  title: string;
  severity: Severity;
  tag: string;
  icon: string;
  explanation: string;
  quote: string;
}

export interface RawAnalysisResponse {
  docType: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  dangerCount: number;
  warningCount: number;
  infoCount: number;
  goodCount?: number;
  findings: RawFinding[];
}

// ─── App State ────────────────────────────────────────────────────────────────

export type AppView = "input" | "loading" | "results" | "error";

export interface AppError {
  message: string;
  code?: string;
  retryable: boolean;
}

// ─── History Entry ────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  result: AnalysisResult;
  createdAt: string;
}

// ─── Feature Flags ───────────────────────────────────────────────────────────

export interface FeatureFlags {
  enableFileUpload: boolean;
  enableHistory: boolean;
  enableExport: boolean;
}
