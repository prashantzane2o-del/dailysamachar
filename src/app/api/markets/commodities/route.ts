// src/app/api/markets/commodities/route.ts
import { NextResponse } from "next/server";
import { MarketDataSchema } from "@/entities/market/model/types";

const METALPRICE_API_URL = process.env.METALPRICE_API_URL?.trim() || "https://api.metalpriceapi.com/v1/latest";
const TROY_OUNCE_IN_GRAMS = 31.1034768;

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MetalPriceResponse = {
  success?: boolean;
  timestamp?: number;
  rates?: { INR?: number; XAU?: number; XAG?: number };
  error?: { code?: number; info?: string };
};
type SpotPrice = { price: number; updatedAt?: string };

async function getMetalPriceRates() {
  const apiKey = process.env.METALPRICE_API_KEY?.trim();
  if (!apiKey) throw new Error("METALPRICE_API_KEY is not configured");

  const url = new URL(METALPRICE_API_URL);
  url.searchParams.set("base", "USD");
  url.searchParams.set("currencies", "INR,XAU,XAG");

  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-API-KEY": apiKey },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`MetalpriceAPI returned status: ${response.status}`);

  const data = (await response.json()) as MetalPriceResponse;
  if (data.success === false) throw new Error(data.error?.info || "MetalpriceAPI returned an error");

  const inrPerUsd = data.rates?.INR;
  const goldOuncesPerUsd = data.rates?.XAU;
  const silverOuncesPerUsd = data.rates?.XAG;
  if (
    typeof inrPerUsd !== "number" ||
    !Number.isFinite(inrPerUsd) ||
    inrPerUsd <= 0 ||
    typeof goldOuncesPerUsd !== "number" ||
    !Number.isFinite(goldOuncesPerUsd) ||
    goldOuncesPerUsd <= 0 ||
    typeof silverOuncesPerUsd !== "number" ||
    !Number.isFinite(silverOuncesPerUsd) ||
    silverOuncesPerUsd <= 0
  ) {
    throw new Error("MetalpriceAPI returned incomplete INR, XAU, or XAG rates");
  }

  const updatedAt = typeof data.timestamp === "number" ? new Date(data.timestamp * 1000).toISOString() : undefined;
  return {
    usdInr: inrPerUsd,
    goldUsdPerOz: { price: 1 / goldOuncesPerUsd, updatedAt } satisfies SpotPrice,
    silverUsdPerOz: { price: 1 / silverOuncesPerUsd, updatedAt } satisfies SpotPrice,
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    const { usdInr, goldUsdPerOz, silverUsdPerOz } = await getMetalPriceRates();

    const data = [
      goldUsdPerOz && {
        symbol: "GOLD",
        name: "Gold (10g)",
        price: goldUsdPerOz.price * usdInr * (10 / TROY_OUNCE_IN_GRAMS),
        change: 0,
        percentChange: 0,
        isPositive: true,
        updatedAt: goldUsdPerOz.updatedAt,
      },
      silverUsdPerOz && {
        symbol: "SILVER",
        name: "Silver (1kg)",
        price: silverUsdPerOz.price * usdInr * (1000 / TROY_OUNCE_IN_GRAMS),
        change: 0,
        percentChange: 0,
        isPositive: true,
        updatedAt: silverUsdPerOz.updatedAt,
      },
    ];

    return NextResponse.json(MarketDataSchema.parse(data), {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("[Commodities API Error]:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Live gold and silver prices are temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
