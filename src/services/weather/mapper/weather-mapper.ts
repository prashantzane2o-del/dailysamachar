import { weatherDtoSchema, type WeatherDto } from "../dto/weather";

export type Weather = WeatherDto & { aqi: number | null };

export function mapWeather(input: unknown): Weather {
  const dto = weatherDtoSchema.parse(input);
  return { ...dto, aqi: null };
}
