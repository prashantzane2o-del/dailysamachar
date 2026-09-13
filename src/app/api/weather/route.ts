// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server";
import { weatherApi } from "@/entities/weather/api/weather.api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const defaultCity = process.env.DEFAULT_WEATHER_CITY || "Meerut";

  // 1. Check if a specific city was requested via URL
  let queryParam = request.nextUrl.searchParams.get("city")?.trim().slice(0, 80);

  // 2. If no city provided, detect user's IP Address
  if (!queryParam) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    
    // Extract the first IP if multiple exist (request.ip removed to fix TS error)
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

    // WeatherAPI accepts public IP addresses. 
    // If it's a local IP (development), fallback to default city.
    if (ip && ip !== "::1" && ip !== "127.0.0.1" && ip !== "localhost") {
      queryParam = ip;
    } else {
      queryParam = defaultCity;
    }
  }

  // FIXED: Ensure finalQuery is strictly a string to resolve the TS type error
  const finalQuery = queryParam || defaultCity;

  try {
    const weather = await weatherApi.getWeatherByCity(finalQuery);
    
    return NextResponse.json(weather, {
      // Dynamic IP data shouldn't be cached globally for too long
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
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