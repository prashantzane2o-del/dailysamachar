export const INDIAN_WEATHER_CITIES = [
  "Meerut",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Surat",
  "Chandigarh",
  "Dehradun",
  "Srinagar",
  "Guwahati",
  "Bhubaneswar",
  "Ranchi",
  "Raipur",
  "Panaji",
  "Kochi",
  "Thiruvananthapuram",
  "Visakhapatnam",
  "Varanasi",
  "Agra",
  "Amritsar",
] as const;

export type IndianWeatherCity = (typeof INDIAN_WEATHER_CITIES)[number];

export function isIndianWeatherCity(value: string): value is IndianWeatherCity {
  return (INDIAN_WEATHER_CITIES as readonly string[]).includes(value);
}
