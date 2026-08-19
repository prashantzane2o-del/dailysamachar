import { NextResponse } from "next/server";
import { createWeatherFallback, getWeather } from "@/services/weather";

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city")?.trim();
  if (!city || city.length > 80) return NextResponse.json({ error: "Invalid city" }, { status: 400 });

  try {
    const weather = await getWeather(city);
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Weather unavailable", data: createWeatherFallback(city) }, { status: 502 });
  }
}
