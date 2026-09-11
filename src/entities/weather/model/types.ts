import { z } from "zod";

export const WeatherSchema = z.object({
  temp: z.number(),
  condition: z.string(),
  icon: z.string(),
  city: z.string(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
});

export type WeatherData = z.infer<typeof WeatherSchema>;
