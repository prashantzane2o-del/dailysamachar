"use client";

import { useQuery } from "@tanstack/react-query";
import type { Weather } from "../mapper/weather-mapper";

export function useWeather(city: string, initialData?: Weather) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error("Weather unavailable");
      return (await response.json()) as Weather;
    },
    initialData,
    staleTime: 300_000,
  });
}
