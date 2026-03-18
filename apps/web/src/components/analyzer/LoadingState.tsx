import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";

const MESSAGES = [
  "Reading the fine print...",
  "Scanning for hidden clauses...",
  "Identifying data collection terms...",
  "Checking arbitration clauses...",
  "Analyzing liability limitations...",
];

export function LoadingState() {
  const streamingText = useAppStore((state) => state.streamingText);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-8 w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gray-100 dark:border-gray-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 dark:border-t-white animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-gray-900 text-xs font-bold">C</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <motion.p
            key={0}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CLU is reading the fine print
          </motion.p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Analyzing clauses, constraints & hidden terms
          </p>
        </div>
      </div>

      {streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800 font-mono text-xs leading-relaxed text-gray-600 dark:text-gray-400 overflow-hidden max-h-[300px] relative mt-4"
        >
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
          <div className="whitespace-pre-wrap">{streamingText}</div>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-3.5 ml-1 bg-brand-500 translate-y-0.5"
          />
        </motion.div>
      )}

      <div className="flex gap-1.5">
        {MESSAGES.slice(0, 4).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
