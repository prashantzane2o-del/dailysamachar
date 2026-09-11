"use client";

import { useState, useEffect } from "react";

/**
 * A hook that delays the update of a value until after a specified delay.
 * Perfect for text inputs (like Search) to prevent excessive API calls.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (default is 500ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Clear the timeout if the value changes before the delay passes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
