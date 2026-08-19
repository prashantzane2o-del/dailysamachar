import { HttpMarketAdapter, UnconfiguredMarketAdapter, type MarketAdapter } from "../adapters/market-adapter";
import { mapMarket, type MarketQuote } from "../mapper/market-mapper";

export const MARKET_SYMBOLS = ["SENSEX", "NIFTY50", "BANKNIFTY", "GOLD", "SILVER", "USDINR", "BTC", "ETH"] as const;

export interface MarketRepository {
  listQuotes(signal?: AbortSignal): Promise<MarketQuote[]>;
}

export class DefaultMarketRepository implements MarketRepository {
  constructor(private readonly adapter: MarketAdapter) {}

  async listQuotes(signal?: AbortSignal): Promise<MarketQuote[]> {
    const quotes = await this.adapter.listQuotes(MARKET_SYMBOLS, signal);
    return quotes.map(mapMarket);
  }
}

export function createMarketRepository(): MarketRepository {
  const baseUrl = process.env.MARKET_PROVIDER_URL;
  return new DefaultMarketRepository(baseUrl ? new HttpMarketAdapter(baseUrl) : new UnconfiguredMarketAdapter());
}
