// src/features/weather/ui/weather-panel.tsx
"use client";

import { motion } from "framer-motion";
import { Cloud, CloudLightning, CloudRain, RotateCcw, Snowflake, Sun } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWeather } from "@/entities/weather/lib/use-weather";
import { INDIAN_WEATHER_CITIES, isIndianWeatherCity, type IndianWeatherCity } from "@/entities/weather/model/indian-cities";

export function WeatherPanel({ city }: { city?: string }) {
  const t = useTranslations("common");
  const weatherT = useTranslations("weather");
  const [selectedCity, setSelectedCity] = useState<IndianWeatherCity>(
    city && isIndianWeatherCity(city) ? city : "Meerut",
  );

  const { data: weather, isLoading, isError, refetch } = useWeather(selectedCity);

  const citySelector = (
    <div className="bg-soft border-line rounded-2xl border p-4 sm:flex sm:items-end sm:justify-between sm:gap-5">
      <div className="min-w-0 flex-1">
        <label htmlFor="weather-city" className="text-ink block text-sm font-bold">
          {weatherT("selectCity")}
        </label>
        <p id="weather-city-hint" className="text-muted mt-1 text-xs leading-5">
          {weatherT("cityHint")}
        </p>
      </div>
      <select
        id="weather-city"
        value={selectedCity}
        onChange={(event) => setSelectedCity(event.target.value as IndianWeatherCity)}
        aria-describedby="weather-city-hint"
        className="border-line bg-paper text-ink focus-visible:ring-signal mt-3 min-h-11 w-full rounded-lg border px-3 py-2.5 text-sm font-semibold shadow-sm outline-none focus-visible:ring-2 sm:mt-0 sm:max-w-xs"
      >
        {INDIAN_WEATHER_CITIES.map((indianCity) => (
          <option key={indianCity} value={indianCity}>
            {indianCity}
          </option>
        ))}
      </select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {citySelector}
        <div
          role="status"
          aria-label={t("loading")}
          aria-busy="true"
          className="border-line bg-soft h-36 w-full rounded-2xl border motion-safe:animate-pulse"
        />
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="space-y-4">
        {citySelector}
        <div
          role="alert"
          className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-900/50 dark:bg-red-950 dark:text-red-100"
        >
          <p className="text-sm font-semibold">{weatherT("error")}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:ring-offset-gray-900"
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t("retry")}
          </button>
        </div>
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
    <div className="space-y-4">
      {citySelector}
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-live="polite"
        className="border-line bg-paper flex min-h-36 flex-col justify-between rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-ink line-clamp-1 text-sm font-bold">{weather.city || selectedCity}</h3>
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
            <span>
              {weatherT("humidity")}: {weather.humidity ?? 0}%
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
