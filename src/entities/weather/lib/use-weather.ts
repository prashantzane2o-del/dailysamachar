"use client";

import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../api/weather.api";

export function useWeather(city: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => weatherApi.getWeatherByCityFromRoute(city),
    enabled: !!city,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}
