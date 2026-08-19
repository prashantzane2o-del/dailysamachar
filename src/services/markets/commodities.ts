export type CommoditySymbol = "XAU" | "XAG";

export interface CommodityQuote { symbol: CommoditySymbol; name: "Gold" | "Silver"; currency: string; price: number; previousClose: number; change: number; changePercent: number; unit: "troy ounce"; timestamp: string; isFallback: boolean; }
export interface CommodityResponse { data: CommodityQuote[]; fetchedAt: string; source: "goldapi.io" | "fallback"; }
type GoldApiResponse = { currency?: string; price?: number; prev_close_price?: number; ch?: number; chp?: number; timestamp?: number };

const CURRENCY = process.env.COMMODITIES_CURRENCY ?? "INR";
const API_URL = process.env.GOLD_API_URL ?? "https://www.goldapi.io/api";

function parseQuote(value: unknown, symbol: CommoditySymbol): CommodityQuote {
  if (typeof value !== "object" || value === null) throw new Error("Invalid commodities response");
  const item = value as GoldApiResponse;
  if (typeof item.price !== "number" || !Number.isFinite(item.price)) throw new Error(`Missing ${symbol} price`);
  const previousClose = typeof item.prev_close_price === "number" ? item.prev_close_price : item.price;
  const change = typeof item.ch === "number" ? item.ch : item.price - previousClose;
  return { symbol, name: symbol === "XAU" ? "Gold" : "Silver", currency: item.currency ?? CURRENCY, price: item.price, previousClose, change, changePercent: typeof item.chp === "number" ? item.chp : previousClose ? (change / previousClose) * 100 : 0, unit: "troy ounce", timestamp: item.timestamp ? new Date(item.timestamp * 1000).toISOString() : new Date().toISOString(), isFallback: false };
}

export function createCommodityFallback(symbol: CommoditySymbol): CommodityQuote { return { symbol, name: symbol === "XAU" ? "Gold" : "Silver", currency: CURRENCY, price: 0, previousClose: 0, change: 0, changePercent: 0, unit: "troy ounce", timestamp: new Date().toISOString(), isFallback: true }; }

export async function getCommodityPrices(): Promise<CommodityResponse> {
  const token = process.env.GOLD_API_KEY;
  if (!token) return getCommodityFallbackResponse();
  try {
  const data = await Promise.all(((["XAU", "XAG"] as const)).map(async (symbol) => {
    const response = await fetch(`${API_URL.replace(/\/$/, "")}/${symbol}/${encodeURIComponent(CURRENCY)}`, { headers: { Accept: "application/json", "x-access-token": token }, next: { revalidate: 60, tags: [`commodities:${symbol}:${CURRENCY}`] } });
    if (!response.ok) throw new Error(`Commodity provider returned ${response.status}`);
    return parseQuote(await response.json(), symbol);
  }));
  return { data, fetchedAt: new Date().toISOString(), source: "goldapi.io" };
  } catch {
    return getCommodityFallbackResponse();
  }
}

export function getCommodityFallbackResponse(): CommodityResponse { return { data: [createCommodityFallback("XAU"), createCommodityFallback("XAG")], fetchedAt: new Date().toISOString(), source: "fallback" }; }
