"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

/**
 * Returns the direction of meaningful window scroll movement.
 *
 * The direction starts as `up`, keeping sticky navigation visible until the
 * user has actually scrolled down. Small movements below the threshold are
 * ignored to prevent a header from flickering while the user is scrolling.
 */
export function useScrollDirection(threshold: number = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const scrollThreshold = Number.isFinite(threshold) ? Math.max(0, threshold) : 0;
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        previousScrollY = 0;
        setDirection("up");
        return;
      }

      if (Math.abs(currentScrollY - previousScrollY) < scrollThreshold) {
        return;
      }

      setDirection(currentScrollY > previousScrollY ? "down" : "up");
      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return direction;
}
