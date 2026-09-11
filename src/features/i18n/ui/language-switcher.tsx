// src/features/i18n/ui/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react"; // Ensure lucide-react is installed

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "hi" : "en";

    // 1. Current URL (pathname) ko break karke purana locale naye locale se replace karein
    // Example: "/en/category/sports" -> ["", "en", "category", "sports"] -> ["", "hi", "category", "sports"]
    const pathSegments = pathname.split("/");
    pathSegments[1] = nextLocale;
    const newPathname = pathSegments.join("/");

    // 2. Existing search parameters ko preserve karein (like ?page=2 or ?q=news)
    const currentParams = searchParams.toString();
    const newUrl = currentParams ? `${newPathname}?${currentParams}` : newPathname;

    // 3. Smooth transition ke sath route replace karein
    startTransition(() => {
      router.replace(newUrl, { scroll: false }); // scroll: false preserves the user's scroll position
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={`border-line text-ink hover:text-primary dark:hover:text-primary flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 ${
        isPending ? "cursor-not-allowed opacity-50" : ""
      }`}
      aria-label={locale === "en" ? "Switch to Hindi" : "Switch to English"}
      title={locale === "en" ? "हिन्दी में पढ़ें" : "Read in English"}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "en" ? "हिन्दी" : "English"}</span>
    </button>
  );
}
