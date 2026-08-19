"use client";

import { CloudSun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
type WeatherWidgetData = { city: string; temperatureC: number; condition: string };

function WeatherLoading() { return <div className="h-5 w-40 animate-pulse rounded bg-soft" aria-label="Loading weather" />; }

export function WeatherWidget({ city = "New Delhi" }: { city?: string }) {
  const t = useTranslations("weather");
  const [weather, setWeather] = useState<WeatherWidgetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/weather?city=${encodeURIComponent(city)}`, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        const payload = (await response.json()) as { data?: WeatherWidgetData } & Partial<WeatherWidgetData>;
        if (!response.ok) throw new Error("Weather unavailable");
        return (payload.data ?? payload) as WeatherWidgetData;
      })
      .then(setWeather)
      .catch((error: unknown) => { if ((error as Error).name !== "AbortError") setWeather(null); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [city]);

  if (loading) return <WeatherLoading />;
  if (!weather || weather.condition === "Weather unavailable") return <div className="flex items-center gap-2 text-xs font-semibold text-muted" role="status"><CloudSun className="h-4 w-4 opacity-50" aria-hidden="true" /><span>{t("title")}: {t("empty")}</span></div>;
  return <div className="flex items-center gap-2 text-xs font-semibold" role="region" aria-label={t("title")}><CloudSun className="h-4 w-4 text-signal" aria-hidden="true" /><span>{weather.city}</span><span className="text-muted">{Math.round(weather.temperatureC)}°C</span><span className="hidden text-muted sm:inline">{weather.condition}</span></div>;
}
