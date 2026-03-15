// ============================================================
// CLU — Application Constants
// ============================================================

export const APP_NAME = "CLU";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

// ─── Model ────────────────────────────────────────────────────────────────────
export const ANTHROPIC_MODEL =
  import.meta.env.VITE_ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
export const MAX_TOKENS = Number(import.meta.env.VITE_MAX_TOKENS ?? 2000);
export const MAX_DOCUMENT_CHARS = Number(
  import.meta.env.VITE_MAX_DOCUMENT_CHARS ?? 8000
);
export const MIN_DOCUMENT_CHARS = 50;

// ─── Feature Flags ───────────────────────────────────────────────────────────
export const FEATURE_FLAGS = {
  enableFileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== "false",
  enableHistory: import.meta.env.VITE_ENABLE_HISTORY !== "false",
  enableExport: import.meta.env.VITE_ENABLE_EXPORT !== "false",
} as const;

// ─── Accepted File Types ──────────────────────────────────────────────────────
export const ACCEPTED_FILE_TYPES = {
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "text/html": [".html"],
} as const;

export const MAX_FILE_SIZE_BYTES = 500_000; // 500 KB

// ─── Risk Score Thresholds ────────────────────────────────────────────────────
export const RISK_THRESHOLDS = {
  low: { max: 33, label: "Low Risk", description: "Mostly user-friendly" },
  medium: { max: 66, label: "Medium Risk", description: "Some concerning clauses" },
  high: { max: 100, label: "High Risk", description: "Read carefully before agreeing" },
} as const;

// ─── Document Type Labels ─────────────────────────────────────────────────────
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  auto: "the document",
  tos: "this Terms of Service",
  privacy: "this Privacy Policy",
  license: "this License Agreement",
  eula: "this EULA",
};

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  history: "clu:history",
  theme: "clu:theme",
  lastDocType: "clu:lastDocType",
} as const;

export const MAX_HISTORY_ENTRIES = 20;

// ─── Animation Durations (ms) ─────────────────────────────────────────────────
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
