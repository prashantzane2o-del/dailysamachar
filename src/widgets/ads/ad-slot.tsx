"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Placement = "top" | "sidebar" | "inline" | "sticky" | "video";

// Ad size mapping to reserve space and prevent Cumulative Layout Shift (CLS)
const AD_DIMENSIONS: Record<Placement, { width: string; height: string }> = {
  top: { width: "100%", height: "90px" }, // e.g., Leaderboard 728x90
  sidebar: { width: "300px", height: "250px" }, // e.g., Medium Rectangle
  inline: { width: "100%", height: "250px" },
  sticky: { width: "100%", height: "50px" }, // e.g., Mobile Sticky Banner
  video: { width: "100%", height: "400px" },
};

export function AdSlot({ placement, className }: { placement: Placement; className?: string }) {
  const tCommon = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          node.dataset.loaded = "true";
          // The data-loaded marker is the integration seam for the ad provider.

          // Stop observing once the ad request is triggered
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Trigger 300px before the ad enters the viewport
    );

    observer.observe(node);
    
    return () => observer.disconnect();
  }, []);

  const dimensions = AD_DIMENSIONS[placement];

  return (
    <div
      ref={ref}
      data-placement={placement}
      aria-label={tCommon("advertisement")}
      // Reserving strict dimensions to prevent layout shift (CLS)
      style={{ minHeight: dimensions.height, width: "100%", maxWidth: dimensions.width }}
      className={cn(
        "relative mx-auto flex items-center justify-center overflow-hidden rounded-sm bg-soft text-[10px] font-bold uppercase tracking-widest text-muted transition-colors",
        !isLoaded && "border border-dashed border-line",
        className
      )}
    >
      {!isLoaded && <span>{tCommon("advertisement")}</span>}
    </div>
  );
}
