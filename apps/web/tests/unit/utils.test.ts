import { describe, it, expect } from "vitest";
import {
  getRiskLevel,
  getRiskDescription,
  getRiskLabel,
  sortFindingsBySeverity,
  truncate,
  wordCount,
  estimateReadTime,
  formatFileSize,
  escapeHtml,
  generateId,
} from "@/lib/utils";
import type { Finding } from "@/types";

// ─── getRiskLevel ─────────────────────────────────────────────────────────────
describe("getRiskLevel", () => {
  it("returns low for score 0", () => expect(getRiskLevel(0)).toBe("low"));
  it("returns low for score 33", () => expect(getRiskLevel(33)).toBe("low"));
  it("returns medium for score 34", () => expect(getRiskLevel(34)).toBe("medium"));
  it("returns medium for score 66", () => expect(getRiskLevel(66)).toBe("medium"));
  it("returns high for score 67", () => expect(getRiskLevel(67)).toBe("high"));
  it("returns high for score 100", () => expect(getRiskLevel(100)).toBe("high"));
});

// ─── getRiskLabel ─────────────────────────────────────────────────────────────
describe("getRiskLabel", () => {
  it("returns correct labels", () => {
    expect(getRiskLabel("low")).toBe("Low Risk");
    expect(getRiskLabel("medium")).toBe("Medium Risk");
    expect(getRiskLabel("high")).toBe("High Risk");
  });
});

// ─── getRiskDescription ───────────────────────────────────────────────────────
describe("getRiskDescription", () => {
  it("returns descriptions for each level", () => {
    expect(getRiskDescription("low")).toContain("user-friendly");
    expect(getRiskDescription("medium")).toContain("concerning");
    expect(getRiskDescription("high")).toContain("carefully");
  });
});

// ─── sortFindingsBySeverity ───────────────────────────────────────────────────
describe("sortFindingsBySeverity", () => {
  const base: Omit<Finding, "severity"> = {
    id: "1",
    title: "Test",
    tag: "Test",
    icon: "🔴",
    explanation: "Test",
    quote: "Test",
  };

  it("sorts danger before warning before info before good", () => {
    const findings: Finding[] = [
      { ...base, id: "a", severity: "good" },
      { ...base, id: "b", severity: "danger" },
      { ...base, id: "c", severity: "info" },
      { ...base, id: "d", severity: "warning" },
    ];
    const sorted = sortFindingsBySeverity(findings);
    expect(sorted.map((f) => f.severity)).toEqual(["danger", "warning", "info", "good"]);
  });

  it("does not mutate the original array", () => {
    const findings: Finding[] = [
      { ...base, id: "a", severity: "good" },
      { ...base, id: "b", severity: "danger" },
    ];
    const original = [...findings];
    sortFindingsBySeverity(findings);
    expect(findings).toEqual(original);
  });
});

// ─── truncate ─────────────────────────────────────────────────────────────────
describe("truncate", () => {
  it("returns string as-is if under maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("truncates and adds ellipsis", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });
  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

// ─── wordCount ────────────────────────────────────────────────────────────────
describe("wordCount", () => {
  it("counts words correctly", () => {
    expect(wordCount("hello world")).toBe(2);
    expect(wordCount("  hello   world  ")).toBe(2);
    expect(wordCount("")).toBe(0);
  });
});

// ─── estimateReadTime ─────────────────────────────────────────────────────────
describe("estimateReadTime", () => {
  it("returns at least 1 for any non-empty text", () => {
    expect(estimateReadTime("word")).toBe(1);
  });
  it("estimates based on 200 wpm", () => {
    const text = Array(400).fill("word").join(" ");
    expect(estimateReadTime(text)).toBe(2);
  });
});

// ─── formatFileSize ───────────────────────────────────────────────────────────
describe("formatFileSize", () => {
  it("formats bytes", () => expect(formatFileSize(512)).toBe("512 B"));
  it("formats KB", () => expect(formatFileSize(1024)).toBe("1.0 KB"));
  it("formats MB", () => expect(formatFileSize(1_048_576)).toBe("1.0 MB"));
});

// ─── escapeHtml ───────────────────────────────────────────────────────────────
describe("escapeHtml", () => {
  it("escapes all special HTML chars", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });
  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

// ─── generateId ───────────────────────────────────────────────────────────────
describe("generateId", () => {
  it("returns a string of length 10", () => {
    expect(generateId()).toHaveLength(10);
  });
  it("returns a string of alphanumeric characters", () => {
    expect(generateId()).toMatch(/^[A-Za-z0-9]+$/);
  });
});
