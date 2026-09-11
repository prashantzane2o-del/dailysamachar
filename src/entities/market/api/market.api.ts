import { MarketDataSchema, type MarketData } from "../model/types";

export const marketApi = {
  getMarketData: async (type: "indices" | "commodities" = "indices"): Promise<MarketData> => {
    try {
      const endpoint = type === "commodities" ? "/api/markets/commodities" : "/api/markets";

      const response = await fetch(endpoint, {
        next: { revalidate: 300 },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Market API returned status " + response.status);
      }

      const data: unknown = await response.json();
      const parsedData = MarketDataSchema.safeParse(data);

      if (!parsedData.success) {
        console.error("[Market API Validation Error - " + type + "]:", parsedData.error.format());
        throw new Error("Invalid market data format received.");
      }

      return parsedData.data;
    } catch (error) {
      console.error("[Market API Error - " + type + "]:", error);
      throw error;
    }
  },
};
