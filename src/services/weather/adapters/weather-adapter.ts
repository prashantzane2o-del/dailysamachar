import type { WeatherDto } from "../dto/weather";

export interface WeatherAdapter {
  getWeather(city: string, signal?: AbortSignal): Promise<WeatherDto>;
}

export class HttpWeatherAdapter implements WeatherAdapter {
  constructor(private readonly baseUrl: string) {}

  async getWeather(city: string, signal?: AbortSignal): Promise<WeatherDto> {
    const url = new URL("/weather", this.baseUrl);
    url.searchParams.set("city", city);
    const response = await fetch(url, { signal, next: { revalidate: 300, tags: [`weather:${city.toLowerCase()}`] } });
    if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
    return (await response.json()) as WeatherDto;
  }
}

export class UnconfiguredWeatherAdapter implements WeatherAdapter {
  async getWeather(): Promise<WeatherDto> {
    throw new Error("WEATHER_PROVIDER_URL is not configured");
  }
}
