import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CloudSun } from "lucide-react";
import { weatherApi } from "@/entities/weather/api/weather.api";

export async function WeatherUtilityBar({ locale }: { locale: Locale }) {
  const t = await getTranslations("weather");

  try {
    const weather = await weatherApi.getWeatherByCity("New Delhi");

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
    // If the weather service fails, we show a clean fallback instead of crashing the header.
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
