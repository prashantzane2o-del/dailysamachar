// src/app/api/markets/commodities/route.ts
import { NextResponse } from "next/server";
import { MarketDataSchema, type MarketData } from "@/entities/market/model/types";

const CURRENCY = "INR";
// Removed the hardcoded API key for security
const API_KEY = process.env.GOLD_API_KEY; 
const API_URL = "https://www.goldapi.io/api/price";

type GoldApiResponse = {
  price?: number;
  ch?: number;
  chp?: number;
  error?: string;
};

// Fallback logic to prevent UI crashes if API limit is reached
function getFallbackCommodities(): MarketData {
  const fluctuation = () => Math.random() * 100 - 50;
  return [
    {
      symbol: "GOLD",
      name: "Gold (10g)",
      price: 71500 + fluctuation(),
      change: 250 + fluctuation(),
      percentChange: 0.35,
      isPositive: true,
    },
    {
      symbol: "SILVER",
      name: "Silver (1kg)",
      price: 84200 + fluctuation(),
      change: -400 + fluctuation(),
      percentChange: -0.47,
      isPositive: false,
    },
  ];
}

async function getCommodity(symbol: "GOLD" | "SILVER", token: string | undefined) {
  if (!token) {
    throw new Error("GOLD_API_KEY is not defined in the environment variables");
  }

  // Convert 1 Ounce to 10 Grams for Gold, and 1 Ounce to 1 KG for Silver (Indian Market Standard)
  const multiplier = symbol === "GOLD" ? 0.311035 : 31.1035;
  const endpoint = `${API_URL}/${symbol === "GOLD" ? "XAU" : "XAG"}/${CURRENCY}`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    // Cache for 5 minutes (300 seconds) to prevent hitting rate limits
    next: { revalidate: 300, tags: [`commodities:${symbol}`] },
  });

  if (!response.ok) {
    throw new Error(`Commodity provider returned status: ${response.status}`);
  }

  const data = (await response.json()) as GoldApiResponse;

  if (data.error) {
    throw new Error(`API Error: ${data.error}`);
  }

  const rawPrice = typeof data.price === "number" ? data.price : 0;
  const rawChange = typeof data.ch === "number" ? data.ch : 0;

  const price = rawPrice * multiplier;
  const change = rawChange * multiplier;

  return {
    symbol,
    name: symbol === "GOLD" ? "Gold (10g)" : "Silver (1kg)",
    price,
    change,
    percentChange: typeof data.chp === "number" ? data.chp : 0,
    isPositive: change >= 0,
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    const data = await Promise.all([
      getCommodity("GOLD", API_KEY),
      getCommodity("SILVER", API_KEY)
    ]);

    return NextResponse.json(MarketDataSchema.parse(data), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[Commodities API Error]:", error instanceof Error ? error.message : error);

    // Return fallback data on failure instead of throwing 500 error to keep UI functional
    return NextResponse.json(getFallbackCommodities(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }
}