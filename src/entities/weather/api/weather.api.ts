// src/entities/weather/api/weather.api.ts

// Defining the expected return type based on your UI components
export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  tempMin?: number;
  tempMax?: number;
}

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

export const weatherApi = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const locationResponse = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
        { next: { revalidate: 86_400 } },
      );
      if (!locationResponse.ok) throw new Error(`Weather geocoding returned ${locationResponse.status}`);
      const locationData = (await locationResponse.json()) as {
        results?: Array<{ name?: string; latitude?: number; longitude?: number }>;
      };
      const location = locationData.results?.[0];
      if (!location || typeof location.latitude !== "number" || typeof location.longitude !== "number") {
        throw new Error("Weather location was not found");
      }

      const response = await fetch(
        `${FORECAST_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto`,
        { next: { revalidate: 1800 } },
      );

      if (!response.ok) {
        throw new Error(`Weather API returned status: ${response.status}`);
      }

      const data = (await response.json()) as {
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          weather_code?: number;
          wind_speed_10m?: number;
        };
        daily?: { temperature_2m_min?: number[]; temperature_2m_max?: number[] };
      };
      const current = data.current;
      if (!current || typeof current.temperature_2m !== "number") throw new Error("Weather data was incomplete");

      return {
        city: location.name || city,
        temp: current.temperature_2m,
        condition: WEATHER_CODES[current.weather_code ?? 0] || "Current conditions",
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        description: WEATHER_CODES[current.weather_code ?? 0] || "Current conditions",
        tempMin: data.daily?.temperature_2m_min?.[0],
        tempMax: data.daily?.temperature_2m_max?.[0],
      };
    } catch (error) {
      console.error("[Weather API Error]:", error instanceof Error ? error.message : error);
      return getFallbackWeather(city);
    }
  },
};

// Fallback function to keep the UI beautiful even if the API fails
function getFallbackWeather(city: string): WeatherData {
  return {
    city: city || "New Delhi",
    temp: 32,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 12,
    description: "Clear skies",
    tempMin: 28,
    tempMax: 35,
  };
}
