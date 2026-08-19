import { Market, type MarketDto } from "../dto/market";

export function createMarketRepository() {
  const repository = {
    getLatestMarkets: async (): Promise<Market[]> => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        
        const response = await fetch(`${apiUrl}/api/markets/data`, {
          next: { 
            revalidate: 30, 
            tags: ["markets", "ticker"] 
          },
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          console.warn(`[Market Repository] Failed to fetch market data. Status: ${response.status}`);
          return [];
        }

        const data = await response.json();
        
        if (data && Array.isArray(data.results)) {
          return data.results;
        }
        
        if (data && Array.isArray(data.data)) {
          return data.data;
        }

        return [];
      } catch (error) {
        console.error("[Market Repository] Exception occurred while fetching market data:", error);
        return [];
      }
    },
    listQuotes: async (): Promise<MarketDto[]> => {
      const markets = await repository.getLatestMarkets();
      return markets.map((market) => ({
        id: market.id,
        symbol: market.symbol,
        name: market.name,
        value: market.price,
        change: market.change,
        changePercent: market.changePercent,
        updatedAt: market.updatedAt,
      }));
    }
  };

  return repository;
}

export type MetalRate = {
  id: string;
  label: string;
  unit: string;
  price: number;
  change: number;
  isUp: boolean;
};

export async function getGoldSilverRates(): Promise<MetalRate[]> {
  const quotes = await createMarketRepository().listQuotes();
  return quotes
    .filter((quote) => quote.symbol === "GOLD" || quote.symbol === "SILVER")
    .map((quote) => ({
      id: quote.id,
      label: quote.name,
      unit: "INR",
      price: quote.value,
      change: quote.change,
      isUp: quote.change >= 0,
    }));
}
