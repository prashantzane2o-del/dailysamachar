"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to lock body scroll when modals, mobile menus, or overlays are open.
 * Ensures clean cleanup on unmount and handles iOS Safari touch-action quirks.
 */
export function useScrollLock(isLocked: boolean) {
  // Original styles ko store karne ke liye ref taaki hum smoothly restore kar sakein
  const originalOverflow = useRef<string | null>(null);
  const originalTouchAction = useRef<string | null>(null);

  useEffect(() => {
    // Agar lock false hai, toh kuch mat karo
    if (!isLocked) return;

    // Body ko DOM se access karte hain
    const body = document.body;

    // Current styles save kar lo pehle
    originalOverflow.current = window.getComputedStyle(body).overflow;
    originalTouchAction.current = window.getComputedStyle(body).touchAction;

    // Scroll lock apply karo
    body.style.overflow = "hidden";
    // Mobile browsers (iOS Safari) pe rubber-band scrolling prevent karne ke liye
    body.style.touchAction = "none";

    // Cleanup function: jab component unmount ho ya isLocked false ho jaye, toh wapas original state pe le aao
    return () => {
      if (originalOverflow.current !== null) {
        body.style.overflow = originalOverflow.current;
      } else {
        body.style.overflow = "";
      }

      if (originalTouchAction.current !== null) {
        body.style.touchAction = originalTouchAction.current;
      } else {
        body.style.touchAction = "";
      }
    };
  }, [isLocked]);
}