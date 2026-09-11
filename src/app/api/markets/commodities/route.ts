import { NextResponse } from "next/server";
import { MarketDataSchema, type MarketData } from "@/entities/market/model/types";

type CommoditySymbol = "GOLD" | "SILVER";
type GoldApiResponse = {
  price?: number;
  ch?: number;
  chp?: number;
};

const CURRENCY = process.env.COMMODITIES_CURRENCY ?? "INR";
const API_URL = process.env.GOLD_API_URL ?? "https://www.goldapi.io/api";

function fallbackCommodities(): MarketData {
  return (["GOLD", "SILVER"] as const).map((symbol) => ({
    symbol,
    name: symbol === "GOLD" ? "Gold" : "Silver",
    price: 0,
    change: 0,
    percentChange: 0,
    isPositive: false,
  }));
}

async function getCommodity(symbol: CommoditySymbol, token: string) {
  const response = await fetch(
    API_URL.replace(/\/$/, "") + "/" + (symbol === "GOLD" ? "XAU" : "XAG") + "/" + encodeURIComponent(CURRENCY),
    {
      headers: { Accept: "application/json", "x-access-token": token },
      next: { revalidate: 300, tags: ["commodities:" + symbol] },
    },
  );
  if (!response.ok) throw new Error("Commodity provider returned status " + response.status);

  const data = (await response.json()) as GoldApiResponse;
  const price = typeof data.price === "number" && Number.isFinite(data.price) ? data.price : 0;
  const change = typeof data.ch === "number" && Number.isFinite(data.ch) ? data.ch : 0;
  const percentChange = typeof data.chp === "number" && Number.isFinite(data.chp) ? data.chp : 0;

  return {
    symbol,
    name: symbol === "GOLD" ? "Gold" : "Silver",
    price,
    change,
    percentChange,
    isPositive: change >= 0,
  };
}

export async function GET(): Promise<NextResponse> {
  const token = process.env.GOLD_API_KEY;
  if (!token) return NextResponse.json(fallbackCommodities());

  try {
    const data = await Promise.all((["GOLD", "SILVER"] as const).map((symbol) => getCommodity(symbol, token)));
    return NextResponse.json(MarketDataSchema.parse(data), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[commodities] provider request failed", error);
    return NextResponse.json(fallbackCommodities(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }
}
