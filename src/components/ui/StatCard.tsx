import { cn } from "@/lib/utils";

interface StatCardProps {
  value: number;
  label: string;
  colorClass?: string;
}

export function StatCard({ value, label, colorClass = "text-gray-900 dark:text-gray-100" }: StatCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 text-center">
      <div className={cn("text-2xl font-semibold tabular-nums tracking-tight leading-none", colorClass)}>
        {value}
      </div>
      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
