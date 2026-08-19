import { marketDtoSchema, type MarketDto } from "../dto/market";

export type MarketQuote = MarketDto & { direction: "up" | "down" | "unchanged" };

export function mapMarket(input: unknown): MarketQuote {
  const dto = marketDtoSchema.parse(input);
  return { ...dto, direction: dto.change > 0 ? "up" : dto.change < 0 ? "down" : "unchanged" };
}
