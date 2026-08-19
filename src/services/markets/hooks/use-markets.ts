"use client";

import { useQuery } from "@tanstack/react-query";
import type { MarketQuote } from "../mapper/market-mapper";

export function useMarkets(initialData?: MarketQuote[]) {
  return useQuery({
    queryKey: ["markets", "quotes"],
    queryFn: async () => {
      const response = await fetch("/api/markets");
      if (!response.ok) throw new Error("Markets unavailable");
      return (await response.json()) as MarketQuote[];
    },
    initialData,
    staleTime: 60_000,
  });
}
