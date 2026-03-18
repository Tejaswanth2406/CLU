import { describe, it, expect, beforeEach } from "vitest";
import { historyService } from "@/services/historyService";
import type { AnalysisResult } from "@/types";

const mockResult: AnalysisResult = {
  id: "test-id-001",
  docType: "Terms of Service",
  riskScore: 72,
  riskLevel: "high",
  summary: "This is a test summary.",
  dangerCount: 3,
  warningCount: 2,
  infoCount: 1,
  goodCount: 0,
  findings: [],
  analyzedAt: new Date().toISOString(),
  documentPreview: "By using this service you agree...",
  inputLength: 5000,
};

describe("historyService", () => {
  beforeEach(() => {
    historyService.clear();
  });

  it("starts with an empty history", () => {
    expect(historyService.getAll()).toHaveLength(0);
  });

  it("adds an entry and returns it", () => {
    const entry = historyService.add(mockResult);
    expect(entry).toHaveProperty("id");
    expect(entry.result.id).toBe(mockResult.id);
    expect(historyService.getAll()).toHaveLength(1);
  });

  it("prepends new entries", () => {
    const r1 = { ...mockResult, id: "r1" };
    const r2 = { ...mockResult, id: "r2" };
    historyService.add(r1);
    historyService.add(r2);
    const all = historyService.getAll();
    expect(all[0].result.id).toBe("r2");
    expect(all[1].result.id).toBe("r1");
  });

  it("removes an entry by id", () => {
    const entry = historyService.add(mockResult);
    historyService.remove(entry.id);
    expect(historyService.getAll()).toHaveLength(0);
  });

  it("clears all entries", () => {
    historyService.add(mockResult);
    historyService.add({ ...mockResult, id: "r2" });
    historyService.clear();
    expect(historyService.getAll()).toHaveLength(0);
  });

  it("caps history at MAX_HISTORY_ENTRIES (20)", () => {
    for (let i = 0; i < 25; i++) {
      historyService.add({ ...mockResult, id: `r${i}` });
    }
    expect(historyService.getAll()).toHaveLength(20);
  });
});
