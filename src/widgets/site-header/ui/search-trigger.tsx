// src/widgets/site-header/ui/search-trigger.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Search } from "lucide-react";

export function SearchTrigger() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // URL encode zaroori hai taaki spaces aur special characters break na hon
      const encodedQuery = encodeURIComponent(trimmedQuery);
      // Localized route par bhej rahe hain
      router.push(`/${locale}/search?q=${encodedQuery}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      /* FIXED: max-w-[200px] is now max-w-50 */
      className="relative flex w-full max-w-50 items-center md:max-w-xs"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={locale === "hi" ? "खोजें..." : "Search..."}
        className="border-line text-ink focus:border-primary focus:ring-primary w-full rounded-md border bg-gray-50 py-2 pr-10 pl-3 text-sm transition-colors outline-none focus:bg-white focus:ring-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:bg-gray-950"
        aria-label="Search news"
      />
      <button
        type="submit"
        className="text-muted hover:text-primary absolute top-1/2 right-2 -translate-y-1/2 p-1 transition-colors dark:text-gray-400 dark:hover:text-white"
        aria-label="Submit search"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
