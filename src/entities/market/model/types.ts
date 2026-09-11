import { z } from "zod";

export const MarketItemSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  percentChange: z.number(),
  isPositive: z.boolean(),
});

export const MarketDataSchema = z.array(MarketItemSchema);

export type MarketItem = z.infer<typeof MarketItemSchema>;
export type MarketData = z.infer<typeof MarketDataSchema>;
