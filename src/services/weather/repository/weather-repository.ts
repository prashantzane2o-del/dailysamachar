import { HttpWeatherAdapter, UnconfiguredWeatherAdapter, type WeatherAdapter } from "../adapters/weather-adapter";
import { mapWeather, type Weather } from "../mapper/weather-mapper";

export interface WeatherRepository {
  getByCity(city: string, signal?: AbortSignal): Promise<Weather>;
}

export class DefaultWeatherRepository implements WeatherRepository {
  constructor(private readonly adapter: WeatherAdapter) {}

  async getByCity(city: string, signal?: AbortSignal): Promise<Weather> {
    const normalizedCity = city.trim();
    if (!normalizedCity) throw new Error("City is required");
    return mapWeather(await this.adapter.getWeather(normalizedCity, signal));
  }
}

export function createWeatherRepository(): WeatherRepository {
  const baseUrl = process.env.WEATHER_PROVIDER_URL;
  return new DefaultWeatherRepository(baseUrl ? new HttpWeatherAdapter(baseUrl) : new UnconfiguredWeatherAdapter());
}
