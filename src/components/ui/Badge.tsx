import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  severity?: Severity;
  className?: string;
}

const severityClasses: Record<Severity, string> = {
  danger: "bg-danger-50 text-danger-600",
  warning: "bg-warning-50 text-warning-600",
  info: "bg-info-50 text-info-600",
  good: "bg-success-50 text-success-600",
};

export function Badge({ children, severity, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        severity
          ? severityClasses[severity]
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
        className
      )}
    >
      {children}
    </span>
  );
}
