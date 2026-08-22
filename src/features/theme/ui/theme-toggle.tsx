"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("lightMode") : t("darkMode")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-focus dark:text-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
    </button>
  );
}
