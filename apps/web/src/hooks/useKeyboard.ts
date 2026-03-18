import { useEffect } from "react";

export function useKeyboard(key: string, handler: () => void, deps: unknown[] = []) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
