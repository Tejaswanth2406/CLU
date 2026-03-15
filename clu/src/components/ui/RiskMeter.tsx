import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  description: string;
}

const levelConfig: Record<RiskLevel, { color: string; bar: string; bg: string }> = {
  low: {
    color: "text-success-600",
    bar: "bg-success-400",
    bg: "bg-success-50 dark:bg-success-800/20",
  },
  medium: {
    color: "text-warning-600",
    bar: "bg-warning-400",
    bg: "bg-warning-50 dark:bg-warning-800/20",
  },
  high: {
    color: "text-danger-600",
    bar: "bg-danger-400",
    bg: "bg-danger-50 dark:bg-danger-800/20",
  },
};

export function RiskMeter({ score, level, description }: RiskMeterProps) {
  const config = levelConfig[level];

  return (
    <div className={cn("rounded-xl p-4 flex items-center gap-4", config.bg)}>
      <div className="flex-shrink-0 text-center min-w-[64px]">
        <motion.div
          className={cn("text-4xl font-semibold tabular-nums leading-none tracking-tight", config.color)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {score}
        </motion.div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
          Risk score
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{description}</p>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", config.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
