"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function LiveClock({ locale }: { locale: string }) {
  const tCommon = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const tick = () => {
      // Localize time format based on the current locale
      setTimeStr(
        new Intl.DateTimeFormat(locale, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true, // Formats as 10:30 AM / PM
        }).format(new Date()),
      );
    };

    tick();
    setMounted(true);

    // Update every 10 seconds to keep the time accurate without excessive CPU usage
    const intervalId = setInterval(tick, 10000);

    // Cleanup interval on unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [locale]);

  // Prevent hydration mismatch and Cumulative Layout Shift (CLS)
  if (!mounted) {
    return (
      <span className="inline-block min-w-15 opacity-0" aria-hidden="true">
        {" "}
        {/* FIXED: Replaced min-w-[60px] with min-w-15 */}
        00:00 AM
      </span>
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
