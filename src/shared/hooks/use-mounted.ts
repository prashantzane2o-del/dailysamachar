"use client";

import { useState, useEffect } from "react";

/**
 * A hook to safely check if a component has mounted on the client.
 * Use this to prevent hydration mismatch errors when rendering content
 * that depends on the browser environment (like window, localStorage, or Date).
 *
 * @returns {boolean} true if the component is mounted on the client, false otherwise.
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
