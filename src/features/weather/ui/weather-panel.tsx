"use client";

import { CloudSun, RefreshCw, Wind } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useWeather } from "@/entities/weather/lib/use-weather";

const cities = ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Hyderabad"];

const formatNumber = (locale: string, value: number) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

function WeatherSkeleton() {
  const t = useTranslations("common");

  return (
    <div aria-label={t("loading")} aria-busy="true" role="status" className="space-y-5 motion-safe:animate-pulse">
      <div className="bg-soft h-8 w-48 rounded" />
      <div className="bg-soft h-44 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-soft h-16 rounded" />
        <div className="bg-soft h-16 rounded" />
      </div>
    </div>
  );
}

export function WeatherPanel() {
  const locale = useLocale();
  const t = useTranslations("weather");
  const common = useTranslations("common");
  const [city, setCity] = useState("New Delhi");
  const query = useWeather(city);

  if (query.isLoading) return <WeatherSkeleton />;

  if (query.isError) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">{t("error")}</p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white"
        >
          <RefreshCw size={15} aria-hidden="true" />
          {common("retry")}
        </button>
      </div>
    );
  }

  if (!query.data) {
    return <div className="border-line text-muted rounded-2xl border p-8 text-center">{t("empty")}</div>;
  }

  const weather = query.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="kicker" htmlFor="weather-city">
          {t("selectCity")}
        </label>
        <select
          id="weather-city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="bg-paper rounded-lg border px-3 py-2 text-sm font-semibold"
        >
          {cities.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <section className="bg-ink rounded-3xl p-7 text-white sm:p-10" aria-live="polite">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">{weather.city}</p>
            <h2 className="editorial mt-2 text-3xl font-bold">{weather.condition}</h2>
          </div>
          <CloudSun className="text-yellow-300" size={44} aria-hidden="true" />
        </div>
        <p className="editorial mt-8 text-7xl font-bold tracking-tight">{formatNumber(locale, weather.temp)}°</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="bg-paper rounded-2xl border p-5">
          <p className="text-muted text-xs">{t("humidity")}</p>
          <p className="mt-2 text-2xl font-bold">
            {weather.humidity === undefined ? "—" : formatNumber(locale, weather.humidity) + "%"}
          </p>
        </div>
        <div className="bg-paper rounded-2xl border p-5">
          <p className="text-muted flex items-center gap-2 text-xs">
            <Wind size={14} aria-hidden="true" />
            {t("wind")}
          </p>
          <p className="mt-2 text-2xl font-bold">
            {weather.windSpeed === undefined ? "—" : formatNumber(locale, weather.windSpeed) + " km/h"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WeatherChip({ city = "New Delhi" }: { city?: string }) {
  const locale = useLocale();
  const t = useTranslations("weather");
  const query = useWeather(city);

  if (!query.data) return <span className="text-muted rounded-full border px-3 py-1 text-xs">{t("title")}</span>;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
      <CloudSun size={14} className="text-yellow-500" aria-hidden="true" />
      {query.data.city} · {formatNumber(locale, query.data.temp)}°C
    </span>
  );
}
