// src/widgets/weather/ui/weather-ticker.tsx
"use client";

import { CloudSun, Droplets, Wind, AlertCircle } from "lucide-react";
import { useWeather } from "@/entities/weather/lib/use-weather";

export function WeatherTicker({ city }: { city?: string }) {
  const query = useWeather(city);

  if (query.isLoading) {
    return (
      <div className="bg-soft border-line h-12 w-full min-w-62.5 rounded-lg border motion-safe:animate-pulse" />
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="text-muted bg-soft border-line flex h-12 items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold">
        <AlertCircle className="h-5 w-5" />
        <span>Weather unavailable</span>
      </div>
    );
  }

  const weather = query.data;

  return (
    <div className="bg-paper border-line scrollbar-hide flex h-12 items-center overflow-x-auto rounded-lg border text-sm shadow-sm whitespace-nowrap">
      
      {/* Brand/Label Section */}
      <div className="bg-soft border-line flex shrink-0 items-center gap-2 border-r px-4 py-3 font-bold text-sky-600 dark:text-sky-400">
        <CloudSun className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs tracking-wide uppercase">{weather.city}</span>
      </div>

      {/* Ticker Items */}
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-ink font-bold">{Math.round(weather.temp)}°C</span>
          <span className="text-muted font-medium tracking-wide">{weather.condition}</span>
          
          {weather.humidity !== undefined && (
            <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 ml-2">
              <Droplets className="h-4 w-4" aria-hidden="true" />
              {weather.humidity}%
            </span>
          )}
          
          {weather.windSpeed !== undefined && (
            <span className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400">
              <Wind className="h-4 w-4" aria-hidden="true" />
              {weather.windSpeed} km/h
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
