// src/widgets/site-header/ui/top-utility-bar.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LiveClock } from "@/features/clock/ui/live-clock";

export function TopUtilityBar() {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const tNav = useTranslations("navigation");

  useEffect(() => {
    setMounted(true);
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", options));
  }, [locale]);

  return (
    // FIXED: Changed to light background (bg-slate-50) and black text (text-slate-900) to match the white header perfectly
    <div className="border-b border-slate-200 bg-slate-50 py-1.5 text-[11px] font-bold tracking-wide text-slate-900 sm:text-[13px]">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Live Indicator, Date & Clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-2" aria-live="polite">
            <span
              className="bg-brand-accent h-2 w-2 animate-pulse rounded-full shadow-[0_0_8px_rgba(217,4,41,0.5)]"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Current Date: </span>

            {!mounted ? (
              <span className="inline-block h-4 w-32 animate-pulse rounded bg-slate-200"></span>
            ) : (
              <span>{currentDate}</span>
            )}
          </span>
          <span className="text-slate-300 max-sm:hidden" aria-hidden="true">
            |
          </span>

          <LiveClock locale={locale === "hi" ? "hi-IN" : "en-IN"} />
        </div>

        {/* Right Side: Highlighted Utility Links */}
        <div className="hidden items-center gap-4 sm:flex lg:gap-6">
          {/* FIXED: Highlighted e-Paper with a light theme pill design */}
          <Link
            href="/epaper"
            className="focus-visible:ring-brand-accent rounded-full bg-slate-200 px-3 py-1 text-slate-900 transition-colors outline-none hover:bg-slate-300 focus-visible:ring-2"
          >
            e-Paper
          </Link>

          <div className="h-4 w-px bg-slate-300" aria-hidden="true"></div>

          <Link
            href="/live"
            className="hover:text-brand-accent focus-visible:ring-brand-accent flex items-center gap-1.5 text-slate-900 transition-colors outline-none focus-visible:ring-2"
          >
            <span className="bg-brand-accent inline-block h-2 w-2 rounded-sm" aria-hidden="true"></span>
            {tNav("live", { fallback: "Watch Live" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
