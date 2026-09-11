// src/widgets/site-header/ui/current-date.tsx
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function CurrentDate() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());

    // Optional: Agar aap chahein toh midnight par date auto-update karne ke liye interval laga sakte hain
    // But normally news sites par page load/navigate hone par update kaafi hota hai.
  }, []);

  // Hydration fix: Jab tak client par mount na ho, ek skeleton dikhayein
  if (!mounted || !currentDate) {
    return <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" aria-hidden="true"></div>;
  }

  // Locale ke hisaab se date format karein (English vs Hindi)
  const formattedDate = currentDate.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <time dateTime={currentDate.toISOString()} className="text-muted text-xs font-medium md:text-sm dark:text-gray-400">
      {formattedDate}
    </time>
  );
}
