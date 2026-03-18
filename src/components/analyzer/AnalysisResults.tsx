import { motion } from "framer-motion";
import { RotateCcw, Download } from "lucide-react";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { StatCard } from "@/components/ui/StatCard";
import { FindingCard } from "./FindingCard";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { getRiskDescription, formatDate, estimateReadTime } from "@/lib/utils";
import { FEATURE_FLAGS } from "@/lib/constants";
import type { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

function exportAsText(result: AnalysisResult): void {
  const lines = [
    `CLU Analysis Report`,
    `===================`,
    `Document Type: ${result.docType}`,
    `Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})`,
    `Analyzed: ${formatDate(result.analyzedAt)}`,
    ``,
    `Summary`,
    `-------`,
    result.summary,
    ``,
    `Findings`,
    `--------`,
    ...result.findings.map(
      (f, i) =>
        `${i + 1}. [${f.severity.toUpperCase()}] ${f.title}\n   ${f.explanation}\n   Quote: "${f.quote}"\n`
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clu-analysis-${result.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const reset = useAppStore((s) => s.reset);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
            Analysis complete
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {result.docType} · {result.inputLength.toLocaleString()} chars · ~
            {estimateReadTime(result.documentPreview)} min read
          </p>
        </div>
        <div className="flex items-center gap-2">
          {FEATURE_FLAGS.enableExport && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={() => exportAsText(result)}
            >
              Export
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={14} />} onClick={reset}>
            New
          </Button>
        </div>
      </div>

      {/* Risk meter */}
      <RiskMeter
        score={result.riskScore}
        level={result.riskLevel}
        description={getRiskDescription(result.riskLevel)}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard value={result.dangerCount} label="Danger" colorClass="text-danger-400" />
        <StatCard value={result.warningCount} label="Warnings" colorClass="text-warning-400" />
        <StatCard value={result.infoCount} label="Key points" colorClass="text-info-400" />
      </div>

      {/* Findings */}
      <div className="space-y-2">
        {result.findings.map((finding, i) => (
          <FindingCard key={finding.id} finding={finding} index={i} />
        ))}
      </div>

      {/* Summary */}
      <div className="card p-4 bg-gray-50 dark:bg-gray-800/40">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Plain English Summary
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
      </div>

      <Button variant="secondary" size="md" className="w-full" onClick={reset}>
        ← Analyze another document
      </Button>
    </motion.div>
  );
}
