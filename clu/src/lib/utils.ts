import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "./nanoid";
import type { RiskLevel, Severity } from "@/types";
import { RISK_THRESHOLDS } from "./constants";

// ─── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── ID generation ────────────────────────────────────────────────────────────
export function generateId(): string {
  return nanoid(10);
}

// ─── Risk utilities ───────────────────────────────────────────────────────────
export function getRiskLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.low.max) return "low";
  if (score <= RISK_THRESHOLDS.medium.max) return "medium";
  return "high";
}

export function getRiskLabel(level: RiskLevel): string {
  return RISK_THRESHOLDS[level].label;
}

export function getRiskDescription(level: RiskLevel): string {
  return RISK_THRESHOLDS[level].description;
}

// ─── Severity utilities ───────────────────────────────────────────────────────
export function getSeverityOrder(severity: Severity): number {
  const order: Record<Severity, number> = {
    danger: 0,
    warning: 1,
    info: 2,
    good: 3,
  };
  return order[severity];
}

export function sortFindingsBySeverity<T extends { severity: Severity }>(
  findings: T[]
): T[] {
  return [...findings].sort(
    (a, b) => getSeverityOrder(a.severity) - getSeverityOrder(b.severity)
  );
}

// ─── Text utilities ───────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(str: string): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount(str) / wordsPerMinute);
}

// ─── Date utilities ───────────────────────────────────────────────────────────
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── File utilities ───────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

// ─── Escape HTML ──────────────────────────────────────────────────────────────
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
