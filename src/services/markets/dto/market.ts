import { z } from "zod";

export const marketDtoSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  value: z.number(),
  change: z.number(),
  changePercent: z.number(),
  currency: z.string().min(1),
  observedAt: z.string().datetime({ offset: true }),
});

export type MarketDto = z.infer<typeof marketDtoSchema>;
