// ============================================================
// CLU — History Service (localStorage persistence)
// ============================================================

import type { AnalysisResult, HistoryEntry } from "@/types";
import { MAX_HISTORY_ENTRIES, STORAGE_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/utils";

function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(entries));
  } catch {
    // Storage quota exceeded — silently fail
    console.warn("CLU: Could not persist history to localStorage.");
  }
}

export const historyService = {
  getAll(): HistoryEntry[] {
    return readHistory();
  },

  add(result: AnalysisResult): HistoryEntry {
    const entry: HistoryEntry = {
      id: generateId(),
      result,
      createdAt: new Date().toISOString(),
    };
    const existing = readHistory();
    const updated = [entry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
    writeHistory(updated);
    return entry;
  },

  remove(id: string): void {
    const updated = readHistory().filter((e) => e.id !== id);
    writeHistory(updated);
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.history);
  },
};
