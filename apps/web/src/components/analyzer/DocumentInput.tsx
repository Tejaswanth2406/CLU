import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useFileReader, useKeyboard } from "@/hooks";
import { useAppStore } from "@/store/appStore";
import {
  ACCEPTED_FILE_TYPES,
  DOCUMENT_TYPE_LABELS,
  FEATURE_FLAGS,
  MIN_DOCUMENT_CHARS,
} from "@/lib/constants";
import type { DocumentTypeInput } from "@/types";

const DOC_TYPES: { value: DocumentTypeInput; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "tos", label: "Terms of Service" },
  { value: "privacy", label: "Privacy Policy" },
  { value: "license", label: "License Agreement" },
  { value: "eula", label: "EULA" },
];

export function DocumentInput() {
  const { inputText, docTypeInput, setInputText, setDocTypeInput, analyze } = useAppStore();
  const canAnalyze = inputText.trim().length >= MIN_DOCUMENT_CHARS;

  const { readFile, isReading, fileError } = useFileReader(setInputText);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) readFile(accepted[0]);
    },
    [readFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    noClick: false,
  });

  useKeyboard(
    "Enter",
    () => {
      if (canAnalyze) analyze();
    },
    [canAnalyze, analyze]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {FEATURE_FLAGS.enableFileUpload && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer",
            "transition-colors duration-150",
            isDragActive
              ? "border-gray-400 bg-gray-50 dark:bg-gray-800/50"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <Upload size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragActive ? "Drop it here" : "Drop a document here"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                .txt or .md — max 500 KB
              </p>
            </div>
          </div>
        </div>
      )}

      {fileError && (
        <p className="text-sm text-danger-600 bg-danger-50 rounded-lg px-3 py-2">{fileError}</p>
      )}

      <div className="relative">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 uppercase tracking-wide">
          <FileText size={12} />
          <span>Or paste text</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Paste your ${DOCUMENT_TYPE_LABELS[docTypeInput] ?? "document"} here...\n\nExamples: Terms of Service, Privacy Policy, EULA, License Agreement`}
          rows={8}
          className={cn(
            "w-full px-4 py-3 text-sm font-mono",
            "border border-gray-200 dark:border-gray-700",
            "bg-gray-50 dark:bg-gray-800/50",
            "text-gray-900 dark:text-gray-100",
            "rounded-xl resize-y outline-none",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "focus:border-gray-400 dark:focus:border-gray-500",
            "transition-colors leading-relaxed"
          )}
          disabled={isReading}
        />
        {inputText.trim().length > 0 && (
          <span className="absolute bottom-3 right-3 text-xs text-gray-400">
            {inputText.length.toLocaleString()} chars
          </span>
        )}
      </div>

      {/* Document type selector */}
      <div className="flex gap-2 flex-wrap">
        {DOC_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setDocTypeInput(t.value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-150",
              docTypeInput === t.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!canAnalyze}
        onClick={() => analyze()}
        rightIcon={<span>→</span>}
      >
        Analyze document
      </Button>

      <p className="text-xs text-center text-gray-400 dark:text-gray-600">
        ⌘ + Enter to analyze · Powered by Claude
      </p>
    </motion.div>
  );
}
