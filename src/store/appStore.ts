// ============================================================
// CLU — Global State (Zustand)
// ============================================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AnalysisResult, AppError, AppView, DocumentTypeInput, HistoryEntry } from "@/types";
import { analyzeDocument } from "@/services/analysisService";
import { historyService } from "@/services/historyService";
import { FEATURE_FLAGS } from "@/lib/constants";

interface AppState {
  // ─── View ────────────────────────────────────────────────
  view: AppView;

  // ─── Input ───────────────────────────────────────────────
  inputText: string;
  docTypeInput: DocumentTypeInput;

  // ─── Results ─────────────────────────────────────────────
  result: AnalysisResult | null;

  // ─── Error ───────────────────────────────────────────────
  error: AppError | null;

  // ─── History ─────────────────────────────────────────────
  history: HistoryEntry[];

  // ─── Actions ─────────────────────────────────────────────
  setInputText: (text: string) => void;
  setDocTypeInput: (type: DocumentTypeInput) => void;
  analyze: () => Promise<void>;
  reset: () => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      view: "input",
      inputText: "",
      docTypeInput: "auto",
      result: null,
      error: null,
      history: historyService.getAll(),

      setInputText: (text) => set({ inputText: text }),

      setDocTypeInput: (type) => set({ docTypeInput: type }),

      analyze: async () => {
        const { inputText, docTypeInput } = get();
        const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY ?? "";

        set({ view: "loading", error: null });

        try {
          const result = await analyzeDocument(inputText, docTypeInput, apiKey);
          set({ result, view: "results" });

          if (FEATURE_FLAGS.enableHistory) {
            const entry = historyService.add(result);
            set((state) => ({ history: [entry, ...state.history] }));
          }
        } catch (err) {
          const appError =
            err instanceof Error
              ? {
                  message: err.message,
                  code: (err as { code?: string }).code,
                  retryable: (err as { retryable?: boolean }).retryable ?? true,
                }
              : { message: "An unexpected error occurred.", retryable: true };

          set({ view: "error", error: appError });
        }
      },

      reset: () =>
        set({
          view: "input",
          result: null,
          error: null,
          inputText: "",
        }),

      loadFromHistory: (entry) =>
        set({
          result: entry.result,
          inputText: entry.result.documentPreview,
          view: "results",
          error: null,
        }),

      removeFromHistory: (id) => {
        historyService.remove(id);
        set((state) => ({
          history: state.history.filter((e) => e.id !== id),
        }));
      },

      clearHistory: () => {
        historyService.clear();
        set({ history: [] });
      },
    }),
    { name: "CLU Store" }
  )
);
