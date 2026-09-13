// src/features/i18n/ui/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "hi" : "en";
    const currentParams = searchParams.toString();
    const targetPath = currentParams ? `${pathname}?${currentParams}` : pathname;

    startTransition(() => {
      router.replace(targetPath, { locale: nextLocale, scroll: false });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      // FIXED: Removed dark mode classes. Added permanent light styling with AAA focus rings and larger touch target.
      className={`hover:text-signal focus-visible:ring-signal flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        isPending ? "cursor-not-allowed opacity-50" : ""
      }`}
      aria-label={locale === "en" ? "Switch to Hindi" : "Switch to English"}
      title={locale === "en" ? "हिंदी में पढ़ें" : "Read in English"}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "en" ? "हिंदी" : "English"}</span>
    </button>
  );
}
