"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

export function SearchTrigger() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      } else {
        params.delete("q");
      }
      
      const basePath = pathname.includes("/search") ? pathname : "/search";
      router.push(`${basePath}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== (searchParams.get("q") || "")) {
        handleSearch(query);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch, searchParams]);

  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Search className="absolute left-3 h-4 w-4 text-gray-500" aria-hidden="true" />
      <input
        type="search"
        placeholder="Search news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        aria-label="Search articles"
      />
    </div>
  );
}