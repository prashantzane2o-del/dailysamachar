// src/widgets/market-ticker/ui/metals-ticker.tsx
"use client";

import { ArrowDownRight, ArrowUpRight, Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMarketData } from "@/entities/market/lib/use-market";

// AAA: Skeleton Loader for Layout Shift Prevention
function MetalsLoading() {
  return (
    <div
      className="bg-soft border-line h-12 w-full max-w-xl rounded-lg border motion-safe:animate-pulse"
      role="status"
      aria-label="Loading live bullion prices..."
    />
  );
}

export function MetalsTicker() {
  const t = useTranslations("markets");

  // Explicitly fetching ONLY commodities (Gold/Silver) from our updated API endpoint
  const query = useMarketData("commodities");

  if (query.isLoading) return <MetalsLoading />;

  // Filter out any invalid quotes to prevent NaN/Undefined rendering crashes
  const commodities = query.data?.filter((quote) => quote.price > 0 && quote.symbol) ?? [];

  // AAA: Graceful Degradation / Empty State
  if (query.isError || commodities.length === 0) {
    return (
      <div
        className="text-muted bg-soft border-line flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold"
        role="status"
        aria-live="polite"
      >
        <Coins className="h-5 w-5" aria-hidden="true" />
        <span>{t("empty")}</span>
      </div>
    );
  }

  // Format to Indian Rupee (INR) style without decimals for large bullion prices
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  return (
    <div
      className="bg-paper border-line scrollbar-hide flex items-center overflow-x-auto rounded-lg border text-sm whitespace-nowrap shadow-sm"
      role="region"
      aria-live="polite"
      aria-label={t("tickerLabel")}
    >
      {/* Brand/Label Section */}
      <div className="text-signal bg-soft border-line flex shrink-0 items-center gap-2 border-r px-4 py-3 font-bold">
        <Coins className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs tracking-wide uppercase">{t("live")}</span>
      </div>

      {/* Ticker Items */}
      <div className="flex items-center gap-6 px-6 py-3">
        {commodities.map((quote) => (
          <div className="flex items-center gap-2.5" key={quote.symbol}>
            <span className="text-ink font-bold">{quote.name}</span>
            <span className="text-muted font-medium tracking-wide">₹{formatter.format(quote.price)}</span>

            {/* AAA: High Contrast Trend Indicator */}
            <span
              className={`flex items-center text-xs font-bold ${
                quote.isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
              }`}
              aria-label={quote.isPositive ? t("trendUp") : t("trendDown")}
            >
              {quote.isPositive ? (
                <ArrowUpRight className="mr-0.5 h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="mr-0.5 h-4 w-4" aria-hidden="true" />
              )}
              {/* Show absolute change value to avoid double negative signs (e.g., - -400) */}
              {formatter.format(Math.abs(quote.change))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
