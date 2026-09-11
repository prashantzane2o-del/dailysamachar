"use client";

import { ArrowDownRight, ArrowUpRight, Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMarketData } from "@/entities/market/lib/use-market";

function MetalsLoading() {
  return (
    <div
      className="bg-soft h-5 w-64 rounded motion-safe:animate-pulse"
      role="status"
      aria-label="Loading commodity prices"
    />
  );
}

export function MetalsTicker() {
  const t = useTranslations("markets");
  const query = useMarketData("commodities");

  if (query.isLoading) return <MetalsLoading />;

  const commodities = query.data?.filter((quote) => quote.price > 0) ?? [];
  if (query.isError || commodities.length === 0) {
    return (
      <div className="text-muted flex items-center gap-2 text-xs" role="status" aria-live="polite">
        <Coins className="h-4 w-4" aria-hidden="true" />
        {t("empty")}
      </div>
    );
  }

  const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

  return (
    <div
      className="flex items-center gap-5 overflow-x-auto text-xs whitespace-nowrap"
      role="region"
      aria-live="polite"
      aria-label={t("tickerLabel")}
    >
      <Coins className="text-signal h-4 w-4 shrink-0" aria-hidden="true" />
      {commodities.map((quote) => (
        <div className="flex items-center gap-2" key={quote.symbol}>
          <span className="font-bold">{quote.name}</span>
          <span className="text-muted">₹ {formatter.format(quote.price)}</span>
          <span
            className={quote.isPositive ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}
            aria-label={quote.isPositive ? t("trendUp") : t("trendDown")}
          >
            {quote.isPositive ? (
              <ArrowUpRight className="inline h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="inline h-3.5 w-3.5" aria-hidden="true" />
            )}
            {formatter.format(Math.abs(quote.percentChange))}%
          </span>
        </div>
      ))}
    </div>
  );
}
