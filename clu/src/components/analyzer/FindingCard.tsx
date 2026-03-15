import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Finding } from "@/types";

interface FindingCardProps {
  finding: Finding;
  index: number;
}

const severityBorder: Record<Finding["severity"], string> = {
  danger: "border-l-danger-400",
  warning: "border-l-warning-400",
  info: "border-l-info-400",
  good: "border-l-success-400",
};

export function FindingCard({ finding, index }: FindingCardProps) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={cn(
        "card border-l-[3px] overflow-hidden",
        severityBorder[finding.severity]
      )}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-base leading-none flex-shrink-0">{finding.icon}</span>
        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-0 truncate">
          {finding.title}
        </span>
        <Badge severity={finding.severity} className="flex-shrink-0 hidden sm:inline-flex">
          {finding.tag}
        </Badge>
        <ChevronRight
          size={15}
          className={cn(
            "flex-shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
              <Badge severity={finding.severity} className="mt-3 mb-2 sm:hidden">
                {finding.tag}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
                {finding.explanation}
              </p>
              {finding.quote && (
                <blockquote className="mt-3 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-500 leading-relaxed italic">
                    "{finding.quote}"
                  </p>
                </blockquote>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
