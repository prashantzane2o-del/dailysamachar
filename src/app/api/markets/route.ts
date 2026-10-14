import { NextResponse } from "next/server";
import { MarketDataSchema, type MarketData } from "@/entities/market/model/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REQUEST_TIMEOUT_MS = 8_000;
const EMPTY_MARKET_RESPONSE = { "Cache-Control": "private, no-store", "X-Market-Data": "unavailable" };

function extractMarketData(payload: unknown): MarketData {
  const candidates =
    typeof payload === "object" && payload !== null
      ? [payload, Reflect.get(payload, "data"), Reflect.get(payload, "results")]
      : [payload];

  for (const candidate of candidates) {
    const parsed = MarketDataSchema.safeParse(candidate);
    if (parsed.success) return parsed.data;
  }

  throw new Error("Market provider returned an invalid data shape");
}

export async function GET(): Promise<NextResponse> {
  const providerUrl = process.env.MARKET_PROVIDER_URL?.trim();
  if (!providerUrl || providerUrl === "https://provider.example.com/markets") {
    return NextResponse.json([], { status: 200, headers: EMPTY_MARKET_RESPONSE });
  }

  try {
    const response = await fetch(providerUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`Market provider returned status ${response.status}`);

    const data = extractMarketData(await response.json());
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "private, no-store", "X-Market-Data": "live" },
    });
  } catch (error) {
    console.error("[Markets API Error]:", error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 200, headers: EMPTY_MARKET_RESPONSE });
  }
}
