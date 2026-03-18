import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/appStore";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { HistoryEntry } from "@/types";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

function HistoryItem({
  entry,
  onLoad,
  onDelete,
}: {
  entry: HistoryEntry;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const { result } = entry;
  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <button className="flex-1 text-left min-w-0" onClick={onLoad}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {result.docType}
          </span>
          <Badge
            severity={
              result.riskLevel === "low"
                ? "good"
                : result.riskLevel === "medium"
                  ? "warning"
                  : "danger"
            }
          >
            {result.riskScore}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
          {truncate(result.documentPreview, 80)}
        </p>
        <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1 block">
          {formatRelativeTime(entry.createdAt)}
        </span>
      </button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-danger-400"
        aria-label="Delete"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const { history, loadFromHistory, removeFromHistory, clearHistory } = useAppStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 z-30 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-medium">Analysis history</h2>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    Clear all
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                  <X size={15} />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                  No analyses yet
                </div>
              ) : (
                history.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    onLoad={() => {
                      loadFromHistory(entry);
                      onClose();
                    }}
                    onDelete={() => removeFromHistory(entry.id)}
                  />
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
