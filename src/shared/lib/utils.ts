import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely and resolves style conflicts.
 * FSD Rule: Always use this for dynamic className assignments in UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper to safely parse JSON strings without throwing runtime errors.
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
}
