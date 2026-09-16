// src/app/api/markets/commodities/route.ts
import { NextResponse } from "next/server";
import { MarketDataSchema } from "@/entities/market/model/types";

const CURRENCY = "INR";
// Removed the hardcoded API key for security
const API_KEY = process.env.GOLD_API_KEY; 
const API_URL = "https://www.goldapi.io/api/price";

type GoldApiResponse = {
  price?: number;
  ch?: number;
  chp?: number;
  change?: number;
  change_percent?: number;
  price_per_unit?: {
    gram?: number;
    kilogram?: number;
  };
  error?: string;
};

async function getCommodity(symbol: "GOLD" | "SILVER", token: string | undefined) {
  if (!token) {
    throw new Error("GOLD_API_KEY is not defined in the environment variables");
  }

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
  const rawChange = typeof data.change === "number" ? data.change : (data.ch ?? 0);
  const price =
    symbol === "GOLD"
      ? typeof data.price_per_unit?.gram === "number"
        ? data.price_per_unit.gram * 10
        : rawPrice * (10 / 31.1034768)
      : typeof data.price_per_unit?.kilogram === "number"
        ? data.price_per_unit.kilogram
        : rawPrice * (1000 / 31.1034768);
  const change =
    symbol === "GOLD"
      ? rawChange * (10 / 31.1034768)
      : rawChange * (1000 / 31.1034768);
  const percentChange =
    typeof data.change_percent === "number" ? data.change_percent : typeof data.chp === "number" ? data.chp : 0;

  return {
    symbol,
    name: symbol === "GOLD" ? "Gold (10g)" : "Silver (1kg)",
    price,
    change,
    percentChange,
    isPositive: change >= 0,
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    const data = await Promise.all([
      getCommodity("GOLD", API_KEY),
      getCommodity("SILVER", API_KEY),
    ]);

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
