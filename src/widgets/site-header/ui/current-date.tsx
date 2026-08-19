"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function CurrentDate() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [dateInfo, setDateInfo] = useState({ text: "", iso: "" });

  useEffect(() => {
    // Ye code sirf client side par chalega, isliye hamesha user ka local time dikhega
    const now = new Date();
    setDateInfo({
      text: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now),
      iso: now.toISOString(),
    });
    setMounted(true);
  }, [locale]);

  // Jab tak component mount nahi hota (SSR ke dauran), hum ek stable empty state return karenge
  // Isse UI shift (CLS) nahi hoga aur hydration error avoid ho jayega
  if (!mounted) {
    return (
      <time 
        className="inline-block min-w-37.5 opacity-0" // FIXED: Replaced min-w-[150px] with min-w-37.5
        aria-hidden="true"
      >
        Loading date...
      </time>
    );
  }

  return (
    <time dateTime={dateInfo.iso} aria-label="Current Date" className="animate-in fade-in duration-300">
      {dateInfo.text}
    </time>
  );
}