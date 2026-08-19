import { NextResponse } from "next/server";
import { getCommodityFallbackResponse, getCommodityPrices } from "@/services/markets/commodities";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await getCommodityPrices();
    return NextResponse.json(result, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("[commodities] provider request failed", error);
    return NextResponse.json({ error: "Commodity prices are temporarily unavailable", data: getCommodityFallbackResponse() }, { status: 502 });
  }
}
