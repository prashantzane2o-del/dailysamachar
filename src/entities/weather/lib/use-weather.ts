// src/entities/weather/lib/use-weather.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "../api/weather.api";

export function useWeather(city?: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async (): Promise<WeatherData> => {
      // FIXED: Fetch from our internal Next.js API route instead of calling server methods directly.
      // This protects the API key and properly hits the backend.
      const params = new URLSearchParams();
      if (city) params.append("city", city);

      const response = await fetch(`/api/weather?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    },
    // Always enable, if city is undefined the backend handles the default city
    enabled: true, 
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });
}