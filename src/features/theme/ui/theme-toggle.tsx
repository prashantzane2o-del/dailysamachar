"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/primitives";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Loading theme..."
        className="cursor-not-allowed opacity-50"
      >
        <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-slate-50 transition-all hover:text-red-300" aria-hidden="true" />
      ) : (
        <Sun className="hover:text-signal h-5 w-5 text-slate-900 transition-all" aria-hidden="true" />
      )}
    </Button>
  );
}
