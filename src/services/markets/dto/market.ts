export interface Market {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  updatedAt: string;
}

export type MarketDto = {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
};

import { z } from "zod";

export const marketDtoSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  value: z.number(),
  change: z.number(),
  changePercent: z.number(),
  updatedAt: z.string(),
});

export interface MarketResponse {
  data: Market[];
  status: "success" | "error";
  timestamp: string;
}
