"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface UseLocalStorageOptions<T> {
  /** Override JSON serialization for values that need a custom format. */
  serializer?: (value: T) => string;
  /** Override JSON parsing for values that need a custom format. */
  deserializer?: (value: string) => T;
}

export type UseLocalStorageResult<T> = [T, Dispatch<SetStateAction<T>>];

function readStorageValue<T>(key: string, initialValue: T, deserializer: (value: string) => T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? initialValue : deserializer(storedValue);
  } catch {
    // Storage can be unavailable in private browsing or when access is denied.
    return initialValue;
  }
}

function writeStorageValue<T>(key: string, value: T, serializer: (value: T) => string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, serializer(value));
  } catch {
    // Quota and security errors should not break the UI state update.
  }
}

/**
 * Keeps state synchronized with localStorage when it is available.
 *
 * The initial value is rendered on the server and replaced with the stored
 * value after mount, avoiding hydration mismatches in Next.js applications.
 * Invalid stored data is ignored and treated as missing data.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): UseLocalStorageResult<T> {
  const serializer = options.serializer ?? JSON.stringify;
  const deserializer = options.deserializer ?? JSON.parse;
  const [storedValue, setStoredValue] = useState<T>(() => initialValue);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const initialValueRef = useRef(initialValue);
  const serializerRef = useRef(serializer);
  const deserializerRef = useRef(deserializer);
  const skipNextPersistRef = useRef(false);

  initialValueRef.current = initialValue;
  serializerRef.current = serializer;
  deserializerRef.current = deserializer;

  useEffect(() => {
    const nextValue = readStorageValue(key, initialValueRef.current, deserializerRef.current);
    setStoredValue(nextValue);
    setLoadedKey(key);
  }, [key]);

  useEffect(() => {
    if (loadedKey !== key) {
      return;
    }

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    writeStorageValue(key, storedValue, serializerRef.current);
  }, [key, loadedKey, storedValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        skipNextPersistRef.current = true;
        setStoredValue(initialValueRef.current);
        return;
      }

      try {
        setStoredValue(deserializerRef.current(event.newValue));
      } catch {
        // Ignore malformed values from another tab.
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((value) => {
    setStoredValue(value);
  }, []);

  return [storedValue, setValue];
}
