import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import type { AppError } from "@/types";

interface ErrorStateProps {
  error: AppError;
}

export function ErrorState({ error }: ErrorStateProps) {
  const { analyze, reset } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-12 gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-danger-50 flex items-center justify-center">
        <AlertTriangle size={22} className="text-danger-400" />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          Analysis failed
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{error.message}</p>
      </div>

      <div className="flex gap-2">
        {error.retryable && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => analyze()}
          >
            Try again
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={reset}>
          Start over
        </Button>
      </div>
    </motion.div>
  );
}
