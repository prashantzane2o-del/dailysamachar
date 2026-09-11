import { WeatherSchema, type WeatherData } from "../model/types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

type GeocodingResponse = {
  results?: Array<{ name: string; latitude: number; longitude: number }>;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
};

function describeWeather(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67 || (code >= 80 && code <= 82)) return "Rain";
  if (code <= 77) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Unknown conditions";
}

function weatherIcon(code: number): string {
  if (code === 0) return "sun";
  if (code <= 3) return "cloud-sun";
  if (code <= 48) return "cloud-fog";
  if (code <= 67 || (code >= 80 && code <= 82)) return "cloud-rain";
  if (code <= 77) return "cloud-snow";
  if (code >= 95) return "cloud-lightning";
  return "cloud";
}

async function getWeatherByCity(city: string): Promise<WeatherData> {
  const geocodingUrl = new URL(GEOCODING_URL);
  geocodingUrl.searchParams.set("name", city);
  geocodingUrl.searchParams.set("count", "1");
  geocodingUrl.searchParams.set("language", "en");
  geocodingUrl.searchParams.set("format", "json");

  const geocodingResponse = await fetch(geocodingUrl, {
    next: { revalidate: 1800 },
    headers: { Accept: "application/json" },
  });
  if (!geocodingResponse.ok) throw new Error(`Geocoding API returned status ${geocodingResponse.status}`);

  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;
  const location = geocodingData.results?.[0];
  if (!location) throw new Error(`City not found: ${city}`);

  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("latitude", String(location.latitude));
  forecastUrl.searchParams.set("longitude", String(location.longitude));
  forecastUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");

  const forecastResponse = await fetch(forecastUrl, {
    next: { revalidate: 1800 },
    headers: { Accept: "application/json" },
  });
  if (!forecastResponse.ok) throw new Error(`Forecast API returned status ${forecastResponse.status}`);

  const forecast = (await forecastResponse.json()) as ForecastResponse;
  const current = forecast.current;
  if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
    throw new Error("Invalid weather provider response");
  }

  return WeatherSchema.parse({
    temp: current.temperature_2m,
    condition: describeWeather(current.weather_code),
    icon: weatherIcon(current.weather_code),
    city: location.name,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
  });
}

export const weatherApi = {
  /**
   * Server-side provider call used by Server Components and the API route.
   */
  getWeatherByCity,

  /**
   * Client-side request through the internal Next.js route.
   */
  getWeatherByCityFromRoute: async (city: string): Promise<WeatherData> => {
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Weather API returned status ${response.status}`);
      }

      const data: unknown = await response.json();
      const parsedData = WeatherSchema.safeParse(data);

      if (!parsedData.success) {
        console.error("[Weather API Validation Error]:", parsedData.error.format());
        throw new Error("Invalid weather data format received.");
      }

      return parsedData.data;
    } catch (error) {
      console.error("[Weather API Error]:", error);
      throw error;
    }
  },
};
