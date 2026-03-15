import { motion } from "framer-motion";

const MESSAGES = [
  "Reading the fine print...",
  "Scanning for hidden clauses...",
  "Identifying data collection terms...",
  "Checking arbitration clauses...",
  "Analyzing liability limitations...",
];

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-5"
    >
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
