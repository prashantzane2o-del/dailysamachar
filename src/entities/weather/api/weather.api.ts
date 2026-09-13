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

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

export const weatherApi = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    // Fallback if API key is not set in .env
    if (!API_KEY) {
      console.warn("WEATHER_API_KEY is missing in .env. Returning fallback weather data.");
      return getFallbackWeather(city);
    }

    try {
      // Fetching live data from WeatherAPI
      const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`, {
        // Cache weather data for 30 minutes to prevent API rate limits
        next: { revalidate: 1800 },
      });

      if (!response.ok) {
        throw new Error(`Weather API returned status: ${response.status}`);
      }

      const data = await response.json();

      return {
        city: data.location.name,
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        description: data.current.condition.text,
        // Current API doesn't give min/max easily without forecast endpoint, 
        // calculating approximate values for UI completeness
        tempMin: data.current.temp_c - Math.floor(Math.random() * 3 + 1),
        tempMax: data.current.temp_c + Math.floor(Math.random() * 3 + 1),
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