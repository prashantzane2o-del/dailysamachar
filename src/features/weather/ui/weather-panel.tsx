// src/features/weather/ui/weather-panel.tsx
"use client";

import { motion } from "framer-motion";
import { Cloud, CloudLightning, CloudRain, RotateCcw, Snowflake, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWeather } from "@/entities/weather/lib/use-weather";

export function WeatherPanel({ city }: { city?: string }) {
  const t = useTranslations("common");

  // Note: Ensure your useWeather hook returns these properties or adjust slightly if needed.
  const { data: weather, isLoading, isError, refetch } = useWeather(city);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label={t("loading")}
        aria-busy="true"
        className="border-line bg-soft h-36 w-full rounded-2xl border motion-safe:animate-pulse"
      />
    );
  }

  if (isError || !weather) {
    return (
      <div
        role="alert"
        // FIXED: AAA accessibility contrast for Dark mode error states
        className="flex h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
      >
        <p className="text-sm font-semibold">Failed to load weather</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:ring-offset-gray-900"
        >
          <RotateCcw size={14} aria-hidden="true" />
          {t("retry")}
        </button>
      </div>
    );
  }

  // Weather Icon mapping based on condition
  const condition = weather.condition?.toLowerCase() || "clear";
  const WeatherIcon = condition.includes("rain")
    ? CloudRain
    : condition.includes("cloud")
      ? Cloud
      : condition.includes("snow")
        ? Snowflake
        : condition.includes("thunder")
          ? CloudLightning
          : Sun;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      // FIXED: Standard tokens for card backgrounds and borders
      className="border-line bg-paper flex h-36 flex-col justify-between rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-ink line-clamp-1 text-sm font-bold">{weather.city || city}</h3>
          <p className="text-muted line-clamp-1 text-xs capitalize">{weather.description || condition}</p>
        </div>
        <div className="bg-soft text-brand-primary dark:text-brand-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <WeatherIcon size={20} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-start">
          <span className="text-ink text-4xl font-black">{Math.round(weather.temp)}</span>
          <span className="text-muted mt-1 text-lg font-bold">°C</span>
        </div>
        <div className="text-muted flex shrink-0 flex-col gap-1 text-right text-xs">
          <span>
            H: {Math.round(weather.tempMax ?? 0)}° L: {Math.round(weather.tempMin ?? 0)}°
          </span>
          <span>Humidity: {weather.humidity ?? 0}%</span>
        </div>
      </div>
    </motion.article>
  );
}
