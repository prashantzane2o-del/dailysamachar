import { MarketDataSchema, type MarketData } from "../model/types";

const REQUEST_TIMEOUT_MS = 8_000;

export class MarketApiError extends Error {
  readonly status: number;
  readonly transient: boolean;

  constructor(message: string, status: number, transient: boolean) {
    super(message);
    this.name = "MarketApiError";
    this.status = status;
    this.transient = transient;
  }
}

export const marketApi = {
  getMarketData: async (type: "indices" | "commodities" = "indices"): Promise<MarketData> => {
    try {
      const endpoint = type === "commodities" ? "/api/markets/commodities" : "/api/markets";

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(endpoint, {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
      } catch (error) {
        const message =
          error instanceof Error && error.name === "AbortError"
            ? "Market API request timed out"
            : "Market API request failed";
        throw new MarketApiError(message, 0, true);
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new MarketApiError(
          `Market API returned status ${response.status}`,
          response.status,
          response.status === 408 || response.status === 429 || response.status >= 500,
        );
      }

      const data: unknown = await response.json();
      const parsedData = MarketDataSchema.safeParse(data);

      if (!parsedData.success) {
        console.error("[Market API Validation Error - " + type + "]:", parsedData.error.format());
        throw new Error("Invalid market data format received.");
      }

      return parsedData.data;
    } catch (error) {
      if (error instanceof MarketApiError) throw error;
      throw new MarketApiError("Market API returned an invalid response", 0, false);
    }
  },
};
