// src/app/api/markets/commodities/route.ts
import { NextResponse } from "next/server";
import { MarketDataSchema } from "@/entities/market/model/types";

const GOLD_API_BASE_URL = process.env.GOLD_API_URL?.trim() || "https://api.gold-api.com";
const USD_INR_API_URL = process.env.USD_INR_API_URL?.trim() || "https://open.er-api.com/v6/latest/USD";
const TROY_OUNCE_IN_GRAMS = 31.1034768;

type GoldApiResponse = { price?: number };
type ExchangeRateResponse = { rates?: { INR?: number } };

function getApiKey() {
  return process.env.GOLD_API_KEY?.trim() || process.env.GOLDAPI_API_KEY?.trim() || process.env.GOLD_API_TOKEN?.trim();
}

async function getUsdInrRate() {
  const response = await fetch(USD_INR_API_URL, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300, tags: ["usd-inr-rate"] },
  });

  if (!response.ok) throw new Error(`USD/INR provider returned status: ${response.status}`);

  const data = (await response.json()) as ExchangeRateResponse;
  const rate = data.rates?.INR;
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    throw new Error("USD/INR provider returned an invalid rate");
  }
  return rate;
}

async function getUsdSpotPrice(symbol: "XAU" | "XAG", apiKey: string | undefined) {
  const headers: HeadersInit = { Accept: "application/json" };
  // gold-api.com is currently keyless, but preserve support for account plans that require a key.
  if (apiKey) headers["x-api-key"] = apiKey;

  const response = await fetch(`${GOLD_API_BASE_URL}/price/${symbol}`, {
    headers,
    next: { revalidate: 300, tags: [`gold-api:${symbol}`] },
  });
  if (!response.ok) throw new Error(`Gold API returned status: ${response.status}`);

  const data = (await response.json()) as GoldApiResponse;
  if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price <= 0) {
    throw new Error(`Gold API returned an invalid ${symbol} price`);
  }
  return data.price;
}

export async function GET(): Promise<NextResponse> {
  try {
    const [goldUsdPerOz, silverUsdPerOz, usdInr] = await Promise.all([
      getUsdSpotPrice("XAU", getApiKey()),
      getUsdSpotPrice("XAG", getApiKey()),
      getUsdInrRate(),
    ]);

    const data = [
      {
        symbol: "GOLD",
        name: "Gold (10g)",
        price: goldUsdPerOz * usdInr * (10 / TROY_OUNCE_IN_GRAMS),
        change: 0,
        percentChange: 0,
        isPositive: true,
      },
      {
        symbol: "SILVER",
        name: "Silver (1kg)",
        price: silverUsdPerOz * usdInr * (1000 / TROY_OUNCE_IN_GRAMS),
        change: 0,
        percentChange: 0,
        isPositive: true,
      },
    ];

    return NextResponse.json(MarketDataSchema.parse(data), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[Commodities API Error]:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Live gold and silver prices are temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
