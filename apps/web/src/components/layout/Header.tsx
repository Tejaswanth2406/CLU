import { Sun, Moon, History } from "lucide-react";
import { useTheme } from "@/hooks";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";
import { FEATURE_FLAGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onHistoryClick?: () => void;
}

export function Header({ onHistoryClick }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const history = useAppStore((s) => s.history);

  const cycleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white dark:text-gray-900 text-sm font-bold tracking-tight">
              C
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
              CLU
            </span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-2">
              Legal Document Analyzer
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {FEATURE_FLAGS.enableHistory && history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<History size={15} />}
              onClick={onHistoryClick}
              className="relative"
            >
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-medium",
                    "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                    "flex items-center justify-center"
                  )}
                >
                  {Math.min(history.length, 9)}
                </span>
              )}
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={cycleTheme} aria-label="Toggle theme">
            {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
