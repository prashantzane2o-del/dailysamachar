"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sun, Wind } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useWeather } from "@/services/weather/hooks/use-weather";
import type { Weather } from "@/services/weather";

const cities = ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Hyderabad"];

const number = (locale: string, value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
const time = (locale: string, value: string, timezone: string) =>
  new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: timezone }).format(new Date(value));

function WeatherSkeleton() {
  const t = useTranslations("common");
  return (
    <div aria-label={t("loading")} className="animate-pulse space-y-5">
      <div className="bg-soft h-8 w-48 rounded" />
      <div className="bg-soft h-32 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-soft h-16 rounded" />
        <div className="bg-soft h-16 rounded" />
      </div>
    </div>
  );
}

export function WeatherPanel({ initialData }: { initialData?: Weather }) {
  const locale = useLocale();
  const t = useTranslations("weather");
  const common = useTranslations("common");
  const [city, setCity] = useState(initialData?.city ?? "New Delhi");
  const query = useWeather(city, initialData?.city === city ? initialData : undefined);
  if (query.isLoading) return <WeatherSkeleton />;
  if (query.isError)
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">{t("error")}</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white"
        >
          <RotateCcw size={15} />
          {common("retry")}
        </button>
      </div>
    );
  if (!query.data) return <div className="border-line text-muted rounded-2xl border p-8 text-center">{t("empty")}</div>;
  const weather = query.data;
  const metrics = [
    [t("feelsLike"), `${number(locale, weather.feelsLikeC)}°C`],
    [t("min"), `${number(locale, weather.minTemperatureC)}°C`],
    [t("max"), `${number(locale, weather.maxTemperatureC)}°C`],
    [t("humidity"), `${number(locale, weather.humidityPercent)}${t("humidityUnit")}`],
    [t("wind"), `${number(locale, weather.windSpeedKph)} ${t("windUnit")}`],
    [t("pressure"), `${number(locale, weather.pressureHpa)} ${t("pressureUnit")}`],
    [t("visibility"), `${number(locale, weather.visibilityKm)} ${t("visibilityUnit")}`],
    [t("uvIndex"), number(locale, weather.uvIndex, 1)],
    [t("aqi"), weather.aqi === null ? t("aqiPlaceholder") : number(locale, weather.aqi)],
  ];
  return (
    <div className="space-y-10">
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
          <option value="New Delhi">New Delhi</option>
          {cities.slice(1).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ink rounded-3xl p-7 text-white sm:p-10"
        >
          <p className="text-sm text-slate-300">
            {weather.city} · {weather.condition}
          </p>
          <div className="mt-8 flex items-end gap-4">
            <Sun className="mb-3 text-yellow-300" size={46} aria-hidden="true" />
            <p className="editorial text-7xl font-bold tracking-tight">{number(locale, weather.temperatureC)}°</p>
            <p className="mb-3 text-slate-300">{t("current")}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300">
            <span>
              {t("sunrise")} {time(locale, weather.sunrise, weather.timezone)}
            </span>
            <span>
              {t("sunset")} {time(locale, weather.sunset, weather.timezone)}
            </span>
          </div>
        </motion.section>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {metrics.map(([label, value]) => (
            <div key={label} className="bg-paper rounded-2xl border p-4">
              <p className="text-muted text-xs">{label}</p>
              <p className="mt-2 text-lg font-bold">{value}</p>
            </div>
          ))}
        </section>
      </div>
      <section>
        <h2 className="editorial text-3xl font-bold">{t("hourly")}</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {weather.hourly.slice(0, 12).map((item) => (
            <div key={item.time} className="min-w-24 rounded-2xl border p-4 text-center">
              <p className="text-muted text-xs">{time(locale, item.time, weather.timezone)}</p>
              <p className="mt-3 font-bold">{number(locale, item.temperatureC)}°</p>
              <p className="text-muted mt-2 text-xs">{item.precipitationPercent}%</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="editorial text-3xl font-bold">{t("sevenDay")}</h2>
        <div className="mt-4 divide-y rounded-2xl border">
          {weather.daily.map((item) => (
            <div key={item.date} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="w-28 font-semibold">
                {new Intl.DateTimeFormat(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  timeZone: weather.timezone,
                }).format(new Date(`${item.date}T12:00:00`))}
              </span>
              <span className="text-muted flex items-center gap-2 text-sm">
                <Wind size={15} />
                {item.condition}
              </span>
              <span className="font-semibold">
                {number(locale, item.minTemperatureC)}° / {number(locale, item.maxTemperatureC)}°
              </span>
              <span className="text-muted text-sm">{item.precipitationPercent}%</span>
            </div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        <p className="text-muted text-sm">{t("favoritePlaceholder")}</p>
      </AnimatePresence>
    </div>
  );
}

export function WeatherChip({ initialData }: { initialData?: Weather }) {
  const locale = useLocale();
  const t = useTranslations("weather");
  const query = useWeather(initialData?.city ?? "New Delhi", initialData);
  const weather = query.data;
  if (!weather) return <span className="text-muted rounded-full border px-3 py-1 text-xs">{t("title")}</span>;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
      <Sun size={14} className="text-yellow-500" />
      {weather.city} · {number(locale, weather.temperatureC)}°C
    </span>
  );
}
