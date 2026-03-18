import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { analyzeDocument, AnalysisError } from "@/services/analysisService";


const MOCK_VALID_RESPONSE = {
  docType: "Terms of Service",
  riskScore: 75,
  riskLevel: "high",
  summary: "This Terms of Service allows broad data collection and limits your rights significantly.",
  dangerCount: 3,
  warningCount: 2,
  infoCount: 1,
  goodCount: 0,
  findings: [
    {
      title: "Data sold to third parties",
      severity: "danger",
      icon: "🔴",
      tag: "Data Privacy",
      explanation: "The company can sell your personal data to any third party without further notice.",
      quote: "We may share your information with third-party partners for commercial purposes.",
    },
    {
      title: "Forced arbitration clause",
      severity: "danger",
      icon: "🔴",
      tag: "Arbitration",
      explanation: "You waive your right to sue in court.",
      quote: "All disputes shall be resolved through binding arbitration.",
    },
    {
      title: "Auto-renewal without notice",
      severity: "warning",
      icon: "🟡",
      tag: "Billing",
      explanation: "Subscription renews automatically unless cancelled.",
      quote: "Your subscription will automatically renew each billing period.",
    },
    {
      title: "Unilateral terms changes",
      severity: "warning",
      icon: "🟡",
      tag: "Terms Changes",
      explanation: "Terms can change at any time.",
      quote: "We reserve the right to modify these terms at any time.",
    },
    {
      title: "Service availability",
      severity: "info",
      icon: "🔵",
      tag: "Uptime",
      explanation: "No uptime guarantee is provided.",
      quote: "We do not guarantee uninterrupted access.",
    },
  ],
};

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({
      content: [{ text: JSON.stringify(body) }],
    }),
  });
}

describe("analyzeDocument", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a valid AnalysisResult on success", async () => {
    vi.stubGlobal("fetch", mockFetch(MOCK_VALID_RESPONSE));

    const result = await analyzeDocument(
      "By using our service you agree to our terms...",
      "tos"
    );

    expect(result).toMatchObject({
      docType: "Terms of Service",
      riskScore: 75,
      riskLevel: "high",
    });
    expect(result.findings).toHaveLength(5);
    expect(result.id).toBeDefined();
    expect(result.analyzedAt).toBeDefined();
  });

  it("sorts findings by severity (danger first)", async () => {
    vi.stubGlobal("fetch", mockFetch(MOCK_VALID_RESPONSE));

    const result = await analyzeDocument("text", "auto");
    expect(result.findings[0].severity).toBe("danger");
  });

  it("clamps riskScore to 0-100", async () => {
    vi.stubGlobal("fetch", mockFetch({ ...MOCK_VALID_RESPONSE, riskScore: 150 }));
    const result = await analyzeDocument("text", "auto");
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  it("throws AnalysisError with AUTH_ERROR on 401", async () => {
    vi.stubGlobal("fetch", mockFetch({}, 401));
    await expect(analyzeDocument("text", "auto")).rejects.toMatchObject({
      code: "AUTH_ERROR",
      retryable: false,
    });
  });

  it("throws AnalysisError with RATE_LIMIT on 429", async () => {
    vi.stubGlobal("fetch", mockFetch({}, 429));
    await expect(analyzeDocument("text", "auto")).rejects.toMatchObject({
      code: "RATE_LIMIT",
      retryable: true,
    });
  });

  it("throws AnalysisError with SERVER_ERROR on 500", async () => {
    vi.stubGlobal("fetch", mockFetch({}, 500));
    await expect(analyzeDocument("text", "auto")).rejects.toMatchObject({
      code: "SERVER_ERROR",
    });
  });

  it("throws PARSE_ERROR when response is not valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ content: [{ text: "not valid json {{" }] }),
      })
    );
    await expect(analyzeDocument("text", "auto")).rejects.toMatchObject({
      code: "PARSE_ERROR",
    });
  });

  it("throws VALIDATION_ERROR when findings array is empty", async () => {
    vi.stubGlobal("fetch", mockFetch({ ...MOCK_VALID_RESPONSE, findings: [] }));
    await expect(analyzeDocument("text", "auto")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });

  it("attaches correct finding counts", async () => {
    vi.stubGlobal("fetch", mockFetch(MOCK_VALID_RESPONSE));
    const result = await analyzeDocument("text", "auto");
    expect(result.dangerCount).toBe(2);
    expect(result.warningCount).toBe(2);
    expect(result.infoCount).toBe(1);
  });
});
