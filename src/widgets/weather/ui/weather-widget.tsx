"use client";

import { motion } from "framer-motion";
import { AlertCircle, CloudSun, Droplets, Wind } from "lucide-react";
import { useWeather } from "@/entities/weather/lib/use-weather";

export interface WeatherWidgetProps {
  city?: string;
}

export function WeatherWidget({ city = "Meerut" }: WeatherWidgetProps) {
  const query = useWeather(city);

  if (query.isLoading) {
    return (
      <div
        className="h-48 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900"
        aria-label="Loading weather"
      />
    );
  }

  if (query.isError || !query.data) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-xl border p-5 text-sm text-slate-500">
        <AlertCircle size={18} aria-hidden="true" />
        Weather unavailable
      </div>
    );
  }

  const weather = query.data;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-wide text-gray-600 uppercase dark:text-gray-400">{weather.city}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{weather.condition}</p>
        </div>
        <CloudSun className="h-10 w-10 text-amber-500" aria-hidden="true" />
      </div>

      <p className="font-serif text-5xl font-black tracking-tighter text-gray-900 dark:text-white">{weather.temp}°</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
        {weather.humidity !== undefined && (
          <span className="flex items-center gap-1.5">
            <Droplets className="text-signal h-4 w-4" aria-hidden="true" />
            {weather.humidity}%
          </span>
        )}
        {weather.windSpeed !== undefined && (
          <span className="flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-teal-500" aria-hidden="true" />
            {weather.windSpeed} km/h
          </span>
        )}
      </div>
    </motion.div>
  );
}
