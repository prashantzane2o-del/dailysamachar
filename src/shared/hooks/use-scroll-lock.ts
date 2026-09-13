// src/shared/hooks/use-scroll-lock.ts
"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to lock body scroll when modals, mobile menus, or overlays are open.
 * Ensures clean cleanup on unmount and handles iOS Safari touch-action quirks.
 */
export function useScrollLock(isLocked: boolean) {
  // FIXED: Consolidated into a single ref object and added protection against capturing already-locked states
  const originalStyle = useRef<{ overflow: string; touchAction: string } | null>(null);

  useEffect(() => {
    // If not locked, do nothing
    if (!isLocked) return;

    const body = document.body;

    // FIXED: Only capture the original styles if we haven't already.
    // This prevents capturing "hidden" as the original state during rapid double-clicks.
    if (!originalStyle.current) {
      originalStyle.current = {
        overflow: window.getComputedStyle(body).overflow,
        touchAction: window.getComputedStyle(body).touchAction,
      };
    }

    // Apply scroll lock
    body.style.overflow = "hidden";
    body.style.touchAction = "none"; // Prevents iOS Safari rubber-band scrolling

    // Cleanup: restore original state when unmounted or when isLocked becomes false
    return () => {
      if (originalStyle.current) {
        body.style.overflow = originalStyle.current.overflow;
        body.style.touchAction = originalStyle.current.touchAction;
        // Reset the ref so the next lock cycle captures fresh styles
        originalStyle.current = null;
      } else {
        // Safe fallback
        body.style.overflow = "";
        body.style.touchAction = "";
      }
    };
  }, [isLocked]);
}
