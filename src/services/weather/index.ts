export interface WeatherData {
  city: string;
  temperatureC: number;
  condition: string;
}

export function createWeatherRepository() {
  return {
    async getByCity(city: string): Promise<WeatherData> {
      // 
      // 
      return {
        city,
        temperatureC: 32,
        condition: "Sunny",
      };
    },
  };
}