import { NextResponse } from "next/server";
import { MarketDataSchema, MarketItemSchema, type MarketData } from "@/entities/market/model/types";

const MARKET_SYMBOLS = ["SENSEX", "NIFTY50", "BANKNIFTY", "USDINR", "BTC", "ETH"] as const;

function fallbackMarkets(): MarketData {
  return MARKET_SYMBOLS.map((symbol) => ({
    symbol,
    name: symbol,
    price: 0,
    change: 0,
    percentChange: 0,
    isPositive: false,
  }));
}

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeMarketItem(value: unknown, fallbackSymbol: string) {
  if (typeof value !== "object" || value === null) {
    return MarketItemSchema.parse({
      symbol: fallbackSymbol,
      name: fallbackSymbol,
      price: 0,
      change: 0,
      percentChange: 0,
      isPositive: false,
    });
  }

  const record = value as Record<string, unknown>;
  const change = finiteNumber(record.change);
  return MarketItemSchema.parse({
    symbol: String(record.symbol ?? fallbackSymbol),
    name: String(record.name ?? record.symbol ?? fallbackSymbol),
    price: finiteNumber(record.price ?? record.value),
    change,
    percentChange: finiteNumber(record.percentChange ?? record.changePercent ?? record.change_percent),
    isPositive: change >= 0,
  });
}

async function getMarketData(): Promise<MarketData> {
  const providerUrl = process.env.MARKET_PROVIDER_URL;
  if (!providerUrl) return fallbackMarkets();

  const url = new URL(providerUrl);
  if (url.pathname === "/" || url.pathname === "") url.pathname = "/markets";
  url.searchParams.set("symbols", MARKET_SYMBOLS.join(","));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300, tags: ["markets"] },
  });
  if (!response.ok) throw new Error("Market provider returned status " + response.status);

  const payload: unknown = await response.json();
  const values = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && "data" in payload && Array.isArray(payload.data)
      ? payload.data
      : typeof payload === "object" && payload !== null && "results" in payload && Array.isArray(payload.results)
        ? payload.results
        : null;

  if (!values) throw new Error("Market provider returned an invalid response");

  return MarketDataSchema.parse(
    values.map((value, index) => normalizeMarketItem(value, MARKET_SYMBOLS[index] ?? "MARKET")),
  );
}

export async function GET() {
  try {
    const markets = await getMarketData();
    return NextResponse.json(markets, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[markets] provider request failed", error);
    return NextResponse.json(fallbackMarkets(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }
}
