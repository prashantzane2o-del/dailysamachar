"use client";

import { useQuery } from "@tanstack/react-query";
import { MarketApiError, marketApi } from "../api/market.api";

export function useMarketData(type: "indices" | "commodities" = "indices") {
  return useQuery({
    queryKey: ["market", type],
    queryFn: () => marketApi.getMarketData(type),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: (failureCount, error) => error instanceof MarketApiError && error.transient && failureCount < 2,
    refetchOnWindowFocus: false,
  });
}
