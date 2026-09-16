import { NextRequest, NextResponse } from "next/server";
import { weatherApi } from "@/entities/weather/api/weather.api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor?.split(",")[0]?.trim();

  if (!candidate || candidate === "::1" || candidate === "127.0.0.1" || candidate === "localhost") return null;
  if (candidate.startsWith("10.") || candidate.startsWith("192.168.") || candidate.startsWith("172.16.")) return null;
  return candidate;
}

async function getCityFromIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) return null;
    const result = (await response.json()) as { success?: boolean; city?: string };
    return result.success && result.city?.trim() ? result.city.trim() : null;
  } catch (error) {
    console.warn("[Weather] IP geolocation unavailable", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const defaultCity = process.env.DEFAULT_WEATHER_CITY || "Meerut";
  const requestedCity = request.nextUrl.searchParams.get("city")?.trim().slice(0, 80);
  const detectedCity = requestedCity || (await getCityFromIp(getClientIp(request)));
  const finalCity = detectedCity || defaultCity;

  try {
    const weather = await weatherApi.getWeatherByCity(finalCity);
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
