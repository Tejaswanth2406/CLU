import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { HistoryPanel } from "@/components/layout/HistoryPanel";
import { DocumentInput } from "@/components/analyzer/DocumentInput";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";
import { LoadingState } from "@/components/analyzer/LoadingState";
import { ErrorState } from "@/components/analyzer/ErrorState";
import { useAppStore } from "@/store/appStore";

export default function App() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { view, result, error } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100 !border !border-gray-200 dark:!border-gray-700 !shadow-sm !rounded-xl",
        }}
      />

      <Header onHistoryClick={() => setHistoryOpen(true)} />

      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          {view === "input" && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
                Read the fine print
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
                Paste any Terms of Service, Privacy Policy, or License Agreement. CLU surfaces what
                matters — before you click "I Agree."
              </p>
            </div>
          )}

          {/* Content */}
          <div className="card p-5 sm:p-6">
            {view === "input" && <DocumentInput />}
            {view === "loading" && <LoadingState />}
            {view === "results" && result && <AnalysisResults result={result} />}
            {view === "error" && error && <ErrorState error={error} />}
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-300 dark:text-gray-700 mt-6">
            CLU does not store your documents. Analysis runs via Anthropic Claude API.
          </p>
        </div>
      </main>
    </div>
  );
}
