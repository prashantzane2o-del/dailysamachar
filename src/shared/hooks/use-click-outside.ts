"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export type ClickOutsideEvent = MouseEvent | TouchEvent;

export interface UseClickOutsideOptions {
  /** Disable outside-click handling while the controlled UI is closed. */
  enabled?: boolean;
}

/**
 * Calls a handler when a mouse or touch starts outside the referenced element.
 *
 * The handler is kept in a ref so changing callbacks does not cause document
 * listeners to be attached and detached on every render.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: ClickOutsideEvent) => void,
  options: UseClickOutsideOptions = {},
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (options.enabled === false || typeof document === "undefined") {
      return;
    }

    const handleOutsideInteraction = (event: ClickOutsideEvent) => {
      const element = ref.current;
      const target = event.target;

      if (!element || !(target instanceof Node) || element.contains(target)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [options.enabled, ref]);
}
