import { getTranslations } from "next-intl/server";
import { createWeatherRepository } from "@/services/weather";
import type { Locale } from "@/i18n/routing";
import { CloudSun } from "lucide-react";

export async function WeatherUtilityBar({ locale }: { locale: Locale }) {
  const t = await getTranslations("weather");

  try {
    // Note: 'New Delhi' is hardcoded here, which is acceptable for a default,
    // but ideally, this would come from user preferences/cookies later.
    const weather = await createWeatherRepository().getByCity("New Delhi");
    
    return (
      <div 
        className="flex items-center gap-2 text-[11px] font-semibold tracking-wide"
        role="region"
        aria-label={t("title") || "Weather"}
      >
        <CloudSun className="h-4 w-4 text-muted" aria-hidden="true" />
        <span className="text-ink">{weather.city}</span>
        <span className="text-muted">
          {new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(weather.temperatureC)}°C
        </span>
        <span className="hidden text-muted md:inline-block">
          {weather.condition}
        </span>
      </div>
    );
  } catch (error) {
    // Graceful degradation on failure (Engineering Rule: 16. Error Handling)
    // If the weather service fails, we show a clean fallback instead of crashing the header.
    return (
      <div 
        className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted"
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