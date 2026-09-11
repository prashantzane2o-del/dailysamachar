import { NextRequest, NextResponse } from "next/server";
import { weatherApi } from "@/entities/weather/api/weather.api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const city = request.nextUrl.searchParams.get("city")?.trim().slice(0, 80) || "New Delhi";

  try {
    const weather = await weatherApi.getWeatherByCity(city);
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("Weather API error", error);
    return NextResponse.json(
      { error: "Weather unavailable" },
      {
        status: 502,
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      },
    );
  }
}
