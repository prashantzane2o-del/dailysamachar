"use client";

import { useQuery } from "@tanstack/react-query";
import { marketApi } from "../api/market.api";

export function useMarketData(type: "indices" | "commodities" = "indices") {
  return useQuery({
    queryKey: ["market", type],
    queryFn: () => marketApi.getMarketData(type),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
