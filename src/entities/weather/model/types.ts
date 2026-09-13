// src/entities/weather/model/types.ts
import { z } from "zod";

export const WeatherSchema = z.object({
  temp: z.number(),
  condition: z.string(),
  icon: z.string().optional(),
  city: z.string(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
  // FIXED: Added missing fields used by WeatherPanel UI
  tempMax: z.number().optional(),
  tempMin: z.number().optional(),
  description: z.string().optional(),
});

export type WeatherData = z.infer<typeof WeatherSchema>;
