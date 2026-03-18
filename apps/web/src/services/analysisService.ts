// ============================================================
// CLU — Anthropic Analysis Service
// ============================================================

import type {
  AnalysisResult,
  DocumentTypeInput,
  RawAnalysisResponse,
  RawFinding,
  Finding,
} from "@/types";
import { generateId, getRiskLevel, sortFindingsBySeverity } from "@/lib/utils";


// ─── Errors ───────────────────────────────────────────────────────────────────

export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = true
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

// ─── Response parser ──────────────────────────────────────────────────────────

function parseApiResponse(raw: string): RawAnalysisResponse {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as RawAnalysisResponse;
  } catch {
    throw new AnalysisError(
      "CLU received an unexpected response format. Please try again.",
      "PARSE_ERROR",
      true
    );
  }
}

function normalizeFindings(raw: RawFinding[]): Finding[] {
  return raw.map((f) => ({
    ...f,
    id: generateId(),
    severity: (["danger", "warning", "info", "good"].includes(f.severity)
      ? f.severity
      : "info") as Finding["severity"],
  }));
}

function validateResponse(data: RawAnalysisResponse): void {
  if (typeof data.riskScore !== "number") {
    throw new AnalysisError("Invalid risk score in response.", "VALIDATION_ERROR", true);
  }
  if (!Array.isArray(data.findings) || data.findings.length === 0) {
    throw new AnalysisError("No findings returned in response.", "VALIDATION_ERROR", true);
  }
}

// ─── Main analyze function ────────────────────────────────────────────────────

export async function analyzeDocument(
  text: string,
  docTypeInput: DocumentTypeInput
): Promise<AnalysisResult> {
  const response = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      docType: docTypeInput,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) {
      throw new AnalysisError("Invalid API key configured on server.", "AUTH_ERROR", false);
    }
    if (status === 429) {
      throw new AnalysisError("Rate limit reached on server. Please wait a moment.", "RATE_LIMIT", true);
    }
    if (status >= 500) {
      throw new AnalysisError("CLU Backend is temporarily unavailable.", "SERVER_ERROR", true);
    }
    throw new AnalysisError(`Unexpected error (HTTP ${status}).`, "HTTP_ERROR", true);
  }

  const json = await response.json();
  const rawText: string = json.content?.map((c: { text?: string }) => c.text ?? "").join("") ?? "";

  const parsed = parseApiResponse(rawText);
  validateResponse(parsed);

  const findings = sortFindingsBySeverity(normalizeFindings(parsed.findings));

  return {
    id: generateId(),
    docType: parsed.docType as AnalysisResult["docType"],
    riskScore: Math.round(Math.min(100, Math.max(0, parsed.riskScore))),
    riskLevel: parsed.riskLevel ?? getRiskLevel(parsed.riskScore),
    summary: parsed.summary,
    dangerCount: findings.filter((f) => f.severity === "danger").length,
    warningCount: findings.filter((f) => f.severity === "warning").length,
    infoCount: findings.filter((f) => f.severity === "info").length,
    goodCount: findings.filter((f) => f.severity === "good").length,
    findings,
    analyzedAt: new Date().toISOString(),
    documentPreview: text.slice(0, 200),
    inputLength: text.length,
  };
}

export async function streamAnalysis(
  input: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch("http://localhost:3001/api/analyze/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new AnalysisError("Streaming failed", "STREAM_ERROR", true);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new AnalysisError("Failed to read stream", "STREAM_ERROR", true);
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    onChunk(chunk);
  }
}
