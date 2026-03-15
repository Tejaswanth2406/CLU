import { useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { MIN_DOCUMENT_CHARS } from "@/lib/constants";

export function useAnalysis() {
  const {
    view,
    inputText,
    docTypeInput,
    result,
    error,
    setInputText,
    setDocTypeInput,
    analyze,
    reset,
  } = useAppStore();

  const canAnalyze = inputText.trim().length >= MIN_DOCUMENT_CHARS;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;
    await analyze();
  }, [analyze, canAnalyze]);

  return {
    view,
    inputText,
    docTypeInput,
    result,
    error,
    canAnalyze,
    setInputText,
    setDocTypeInput,
    handleAnalyze,
    reset,
  };
}
