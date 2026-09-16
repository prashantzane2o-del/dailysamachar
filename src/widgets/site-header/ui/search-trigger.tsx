// src/widgets/site-header/ui/search-trigger.tsx
"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export function SearchTrigger() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("header");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      const encodedQuery = encodeURIComponent(trimmedQuery);
      router.push(`/search?q=${encodedQuery}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative ml-1 flex min-w-0 shrink items-center sm:ml-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        // FIXED: Removed text-ink and bg-soft/paper dynamic vars. Enforced permanent light mode colors.
        // Added high contrast placeholder-slate-500.
        className="focus:border-signal focus:ring-signal w-10 rounded-full border border-slate-300 bg-slate-100 py-2 pr-9 pl-3 text-sm text-transparent placeholder-transparent transition-all duration-300 outline-none focus:w-44 focus:bg-white focus:text-slate-900 focus:placeholder-slate-500 focus:ring-2 sm:w-36 sm:pl-4 sm:text-slate-900 sm:placeholder-slate-500 md:w-44 md:focus:w-56 lg:w-56 lg:focus:w-72"
        aria-label={t("searchStories")}
      />
      <button
        type="submit"
        // FIXED: Added accessible touch target size (h-8 w-8) and proper focus ring
        className="hover:text-signal focus-visible:ring-signal absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label={t("search")}
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
