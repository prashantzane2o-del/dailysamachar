import { NextRequest, NextResponse } from "next/server";
import { weatherApi } from "@/entities/weather/api/weather.api";
import { isIndianWeatherCity } from "@/entities/weather/model/indian-cities";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestedCity = request.nextUrl.searchParams.get("city")?.trim() || "Meerut";
  if (!isIndianWeatherCity(requestedCity)) {
    return NextResponse.json({ error: "Please choose an Indian city from the available list." }, { status: 400 });
  }

  try {
    const weather = await weatherApi.getWeatherByCity(requestedCity);
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Weather API error", error);
    return NextResponse.json(
      { error: "Weather unavailable" },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
