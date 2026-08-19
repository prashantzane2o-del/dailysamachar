import type { Weather } from "./mapper/weather-mapper";

type GeocodingResult = { name: string; latitude: number; longitude: number; country_code?: string };
type GeocodingResponse = { results?: GeocodingResult[] };
type ForecastResponse = {
  timezone: string;
  current: { time: string; temperature_2m: number; apparent_temperature: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number; surface_pressure: number; visibility: number; uv_index: number };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; precipitation_probability: number[] };
  daily: { time: string[]; temperature_2m_min: number[]; temperature_2m_max: number[]; weather_code: number[]; sunrise: string[]; sunset: string[] };
};

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const weatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown conditions";
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

async function fetchJson<T>(url: URL, tags: string[], revalidate: number): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate, tags } });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
  return (await response.json()) as T;
}

export function createWeatherFallback(city: string): Weather {
  const now = new Date().toISOString();
  return { city, countryCode: "IN", observedAt: now, timezone: "Asia/Kolkata", condition: "Weather unavailable", temperatureC: 0, feelsLikeC: 0, minTemperatureC: 0, maxTemperatureC: 0, humidityPercent: 0, windSpeedKph: 0, pressureHpa: 0, visibilityKm: 0, uvIndex: 0, sunrise: now, sunset: now, hourly: [], daily: [], aqi: null };
}

export async function getWeather(city = "New Delhi"): Promise<Weather> {
  const normalizedCity = city.trim().replace(/[^\p{L}\p{N}\s-]/gu, "").slice(0, 80);
  if (!normalizedCity) throw new Error("A valid city is required");

  const locationUrl = new URL(GEOCODING_URL);
  locationUrl.searchParams.set("name", normalizedCity);
  locationUrl.searchParams.set("count", "1");
  locationUrl.searchParams.set("language", "en");
  locationUrl.searchParams.set("format", "json");
  const location = await fetchJson<GeocodingResponse>(locationUrl, [`weather:location:${normalizedCity.toLowerCase()}`], 86_400);
  const result = location.results?.[0];
  if (!result) throw new Error(`City not found: ${normalizedCity}`);

  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("latitude", String(result.latitude));
  forecastUrl.searchParams.set("longitude", String(result.longitude));
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", "7");
  forecastUrl.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,visibility,uv_index");
  forecastUrl.searchParams.set("hourly", "temperature_2m,weather_code,precipitation_probability");
  forecastUrl.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,weather_code,sunrise,sunset");
  const forecast = await fetchJson<ForecastResponse>(forecastUrl, [`weather:${normalizedCity.toLowerCase()}`], 300);
  if (!isRecord(forecast) || !isRecord(forecast.current) || !isRecord(forecast.hourly) || !isRecord(forecast.daily)) throw new Error("Invalid weather provider response");

  const { current, hourly, daily } = forecast;
  return {
    city: result.name, countryCode: result.country_code, observedAt: current.time, timezone: forecast.timezone,
    condition: weatherDescription(current.weather_code), temperatureC: current.temperature_2m, feelsLikeC: current.apparent_temperature,
    minTemperatureC: daily.temperature_2m_min[0] ?? current.temperature_2m, maxTemperatureC: daily.temperature_2m_max[0] ?? current.temperature_2m,
    humidityPercent: current.relative_humidity_2m, windSpeedKph: current.wind_speed_10m, pressureHpa: current.surface_pressure,
    visibilityKm: current.visibility / 1000, uvIndex: current.uv_index, sunrise: daily.sunrise[0] ?? current.time, sunset: daily.sunset[0] ?? current.time,
    hourly: hourly.time.slice(0, 24).map((time, index) => ({ time, temperatureC: hourly.temperature_2m[index] ?? current.temperature_2m, condition: weatherDescription(hourly.weather_code[index] ?? current.weather_code), precipitationPercent: hourly.precipitation_probability[index] ?? 0 })),
    daily: daily.time.map((date, index) => ({ date, minTemperatureC: daily.temperature_2m_min[index] ?? current.temperature_2m, maxTemperatureC: daily.temperature_2m_max[index] ?? current.temperature_2m, condition: weatherDescription(daily.weather_code[index] ?? current.weather_code), precipitationPercent: 0 })),
    aqi: null,
  };
}

export type { Weather };
export function createWeatherRepository() { return { getByCity: getWeather }; }
