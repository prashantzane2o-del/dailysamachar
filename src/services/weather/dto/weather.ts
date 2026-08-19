import { z } from "zod";

export const weatherDtoSchema = z.object({
  city: z.string().min(1),
  countryCode: z.string().length(2).optional(),
  observedAt: z.string().datetime({ offset: true }),
  timezone: z.string().min(1),
  condition: z.string().min(1),
  icon: z.string().min(1).optional(),
  temperatureC: z.number(),
  feelsLikeC: z.number(),
  minTemperatureC: z.number(),
  maxTemperatureC: z.number(),
  humidityPercent: z.number().min(0).max(100),
  windSpeedKph: z.number().min(0),
  pressureHpa: z.number().nonnegative(),
  visibilityKm: z.number().nonnegative(),
  uvIndex: z.number().nonnegative(),
  sunrise: z.string().datetime({ offset: true }),
  sunset: z.string().datetime({ offset: true }),
  hourly: z
    .array(
      z.object({
        time: z.string().datetime({ offset: true }),
        temperatureC: z.number(),
        condition: z.string(),
        precipitationPercent: z.number().min(0).max(100),
      }),
    )
    .max(24),
  daily: z
    .array(
      z.object({
        date: z.string().date(),
        minTemperatureC: z.number(),
        maxTemperatureC: z.number(),
        condition: z.string(),
        precipitationPercent: z.number().min(0).max(100),
      }),
    )
    .max(7),
});

export type WeatherDto = z.infer<typeof weatherDtoSchema>;
