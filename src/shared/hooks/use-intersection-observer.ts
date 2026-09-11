"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Stop observing after the element has become visible once. */
  freezeOnceVisible?: boolean;
  /** Skip observing while disabled. */
  disabled?: boolean;
}

export interface UseIntersectionObserverResult<T extends Element> {
  ref: RefObject<T | null>;
  entry: IntersectionObserverEntry | undefined;
  isIntersecting: boolean;
}

/**
 * Observes the visibility of an element without touching browser APIs during
 * server rendering. Useful for lazy content and infinite-feed sentinels.
 */
export function useIntersectionObserver<T extends Element = HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult<T> {
  const { disabled = false, freezeOnceVisible = false, root = null, rootMargin = "0px", threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);
  const entryRef = useRef<IntersectionObserverEntry | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;

    if (disabled || !element || typeof IntersectionObserver === "undefined") {
      return;
    }

    if (freezeOnceVisible && entryRef.current?.isIntersecting) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    observer = new IntersectionObserver(
      ([nextEntry]) => {
        if (!nextEntry) {
          return;
        }

        entryRef.current = nextEntry;
        setEntry(nextEntry);

        if (freezeOnceVisible && nextEntry.isIntersecting) {
          observer?.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [disabled, freezeOnceVisible, root, rootMargin, threshold]);

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}
