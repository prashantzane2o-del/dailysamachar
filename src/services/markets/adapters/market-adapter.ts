import type { MarketDto } from "../dto/market";

export interface MarketAdapter {
  listQuotes(symbols: readonly string[], signal?: AbortSignal): Promise<MarketDto[]>;
}

export class HttpMarketAdapter implements MarketAdapter {
  constructor(private readonly baseUrl: string) {}

  async listQuotes(symbols: readonly string[], signal?: AbortSignal): Promise<MarketDto[]> {
    const url = new URL("/markets", this.baseUrl);
    url.searchParams.set("symbols", symbols.join(","));
    const response = await fetch(url, { signal, next: { revalidate: 60, tags: ["markets"] } });
    if (!response.ok) throw new Error(`Market provider returned ${response.status}`);
    return (await response.json()) as MarketDto[];
  }
}

export class UnconfiguredMarketAdapter implements MarketAdapter {
  async listQuotes(): Promise<MarketDto[]> {
    throw new Error("MARKET_PROVIDER_URL is not configured");
  }
}
