// src/features/theme/ui/theme-toggle.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme..."
        className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full opacity-50"
      >
        <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200" />
      </button>
    );
  }

  // resolvedTheme reflects the OS preference when theme === "system".
  const isDark = resolvedTheme === "dark";
  const usesSystemTheme = theme === "system";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={usesSystemTheme ? `Using device ${isDark ? "dark" : "light"} theme` : isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="hover:text-signal focus-visible:ring-signal flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
