// src/widgets/weather/weather-utility-bar.tsx
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import type { Locale } from "@/i18n/routing";
import { CloudSun } from "lucide-react";
import { weatherApi } from "@/entities/weather/api/weather.api";

export async function WeatherUtilityBar({ locale }: { locale: Locale }) {
  const t = await getTranslations("weather");
  const defaultCity = process.env.DEFAULT_WEATHER_CITY || "Meerut";
  
  let queryParam = defaultCity;

  try {
    // Next.js 15 requires awaiting headers()
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    // Extract the first IP if multiple exist
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

    // Use IP if valid, otherwise fallback to default city
    if (ip && ip !== "::1" && ip !== "127.0.0.1" && ip !== "localhost") {
      queryParam = ip;
    }
  } catch (e) {
    // Gracefully ignore header errors during static page generation
  }

  try {
    const weather = await weatherApi.getWeatherByCity(queryParam);

    return (
      <div
        className="flex items-center gap-2 text-[11px] font-semibold tracking-wide"
        role="region"
        aria-label={t("title") || "Weather"}
      >
        <CloudSun className="text-muted h-4 w-4" aria-hidden="true" />
        <span className="text-ink">{weather.city}</span>
        <span className="text-muted">
          {new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(weather.temp)}°C
        </span>
        <span className="text-muted hidden md:inline-block">{weather.condition}</span>
      </div>
    );
  } catch {
    // Graceful degradation on failure (Engineering Rule: 16. Error Handling)
    return (
      <div
        className="text-muted flex items-center gap-2 text-[11px] font-semibold tracking-wide"
        role="region"
        aria-label={t("title") || "Weather"}
      >
        <CloudSun className="h-4 w-4 opacity-50" aria-hidden="true" />
        <span>{t("title")}</span>
        <span>-</span>
        <span>{t("empty")}</span>
      </div>
    );
  }
}