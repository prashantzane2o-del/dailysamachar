import { NextResponse } from "next/server";
import { createMarketRepository } from "@/services/markets";

export async function GET() {
  try {
    const markets = await createMarketRepository().listQuotes();
    return NextResponse.json(markets, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "Markets unavailable" }, { status: 503 });
  }
}
