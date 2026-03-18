// ============================================================
// CLU — Global State (Zustand)
// ============================================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AnalysisResult, AppError, AppView, DocumentTypeInput, HistoryEntry } from "@/types";
import { analyzeDocument, streamAnalysis } from "@/services/analysisService";
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
  streamingText: string;

  // ─── Error ───────────────────────────────────────────────
  error: AppError | null;

  // ─── History ─────────────────────────────────────────────
  history: HistoryEntry[];

  // ─── Actions ─────────────────────────────────────────────
  setInputText: (text: string) => void;
  setDocTypeInput: (type: DocumentTypeInput) => void;
  analyze: () => Promise<void>;
  streamAnalyze: () => Promise<void>;
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
      streamingText: "",
      error: null,
      history: historyService.getAll(),

      setInputText: (text) => set({ inputText: text }),

      setDocTypeInput: (type) => set({ docTypeInput: type }),

      streamAnalyze: async () => {
        const { inputText } = get();
        set({ view: "loading", error: null, streamingText: "" });

        try {
          await streamAnalysis(inputText, (chunk) => {
            set((state) => ({ streamingText: state.streamingText + chunk }));
          });
          // Note: After streaming, the user usually wants the full structured result. 
          // For now, we'll just show the stream. In a real app we'd trigger a final parse.
          set({ view: "results" }); 
        } catch (err) {
          set({ view: "error", error: { message: "Streaming failed", retryable: true } });
        }
      },

      analyze: async () => {
        const { inputText, docTypeInput } = get();

        set({ view: "loading", error: null, streamingText: "" });

        try {
          // 1. Start Streaming (for UX)
          try {
            await streamAnalysis(inputText, (chunk) => {
              // Anthropic stream chunks are often JSON fragments or delta objects.
              // For a simple demo, we'll just show the raw output or a simplified version.
              set((state) => ({ streamingText: state.streamingText + chunk }));
            });
          } catch (streamErr) {
            console.warn("Streaming failed, falling back to standard analysis", streamErr);
          }

          // 2. Get Final Structured Result (will be a cache hit if streaming finished)
          const result = await analyzeDocument(inputText, docTypeInput);
          set({ result, view: "results", streamingText: "" });

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
