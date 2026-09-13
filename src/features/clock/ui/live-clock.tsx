// src/features/clock/ui/live-clock.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function LiveClock({ locale }: { locale: string }) {
  const tCommon = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const tick = () => {
      setTimeStr(
        new Intl.DateTimeFormat(locale, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    };
    tick();
    setMounted(true);

    const intervalId = setInterval(tick, 10000);
    return () => clearInterval(intervalId);
  }, [locale]);

  if (!mounted) {
    return (
      // FIXED: Updated skeleton color from dark blue to slate-200 to match the light theme
      <span className="inline-block h-4 w-16 animate-pulse rounded bg-slate-200" aria-hidden="true"></span>
    );
  }

  return (
    <time
      aria-label={tCommon("currentTime") || "Current time"}
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
    >
      {timeStr}
    </time>
  );
}
