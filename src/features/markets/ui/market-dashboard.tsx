// src/features/markets/ui/market-dashboard.tsx
"use client";

import { motion } from "framer-motion";
import { RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMarketData } from "@/entities/market/lib/use-market";
import type { MarketItem } from "@/entities/market/model/types";

const symbols = ["SENSEX", "NIFTY50", "BANKNIFTY", "GOLD", "SILVER", "USDINR", "BTC", "ETH"] as const;

const number = (locale: string, value: number) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

function MarketSkeleton() {
  const t = useTranslations("common");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {symbols.map((symbol) => (
        <div
          aria-label={t("loading")}
          aria-busy="true"
          role="status"
          className="bg-soft border-line h-36 rounded-2xl border motion-safe:animate-pulse"
          key={symbol}
        />
      ))}
    </div>
  );
}

function MarketCard({ quote, label }: { quote?: MarketItem; label: string }) {
  const locale = useLocale();
  const t = useTranslations("markets");

  if (!quote || (quote.price === 0 && quote.change === 0 && !quote.isPositive)) {
    return (
      <article className="bg-soft border-line rounded-2xl border p-5">
        <p className="text-ink text-sm font-bold">{label}</p>
        <p className="text-muted mt-6 text-sm">{t("empty")}</p>
      </article>
    );
  }

  const isDown = quote.change < 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper border-line rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-ink text-sm font-bold">{label}</p>
        {quote.isPositive ? (
          <TrendingUp size={18} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
        ) : isDown ? (
          <TrendingDown size={18} className="text-red-700 dark:text-red-400" aria-hidden="true" />
        ) : null}
      </div>
      <p className="text-ink mt-5 text-2xl font-bold tracking-tight">{number(locale, quote.price)}</p>
      <p
        className={
          "mt-2 text-sm font-semibold " +
          (quote.isPositive
            ? "text-emerald-700 dark:text-emerald-400"
            : isDown
              ? "text-red-700 dark:text-red-400"
              : "text-muted")
        }
      >
        {quote.change > 0 ? "+" : ""}
        {number(locale, quote.change)} ({quote.percentChange > 0 ? "+" : ""}
        {number(locale, quote.percentChange)}%)
      </p>
      <p className="text-muted mt-4 text-xs">{t("futureChart")}</p>
    </motion.article>
  );
}

export function MarketDashboard() {
  const t = useTranslations("markets");
  const common = useTranslations("common");
  const indicesQuery = useMarketData("indices");
  const commoditiesQuery = useMarketData("commodities");

  const isLoading = indicesQuery.isLoading || commoditiesQuery.isLoading;
  const isError = indicesQuery.isError || commoditiesQuery.isError;

  const labels = [
    t("sensex"),
    t("nifty50"),
    t("bankNifty"),
    t("gold"),
    t("silver"),
    t("usdInr"),
    t("bitcoin"),
    t("ethereum"),
  ];

  if (isLoading) return <MarketSkeleton />;

  if (isError) {
    return (
      <div
        role="alert"
        // FIXED: AAA accessibility contrast for Dark mode error states
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
      >
        <p className="font-semibold">{t("error")}</p>
        <button
          type="button"
          onClick={() => {
            void indicesQuery.refetch();
            void commoditiesQuery.refetch();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:ring-offset-gray-900"
        >
          <RotateCcw size={15} aria-hidden="true" />
          {common("retry")}
        </button>
      </div>
    );
  }

  const quotes = [...(indicesQuery.data ?? []), ...(commoditiesQuery.data ?? [])];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {symbols.map((symbol, index) => (
        <MarketCard key={symbol} quote={quotes.find((quote) => quote.symbol === symbol)} label={labels[index]} />
      ))}
    </div>
  );
}

export function MarketTicker() {
  const t = useTranslations("markets");
  const query = useMarketData("indices");
  const quote = query.data?.[0];

  return (
    <div className="bg-paper border-line text-ink inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm">
      <span>{t("sensex")}</span>
      <span className={quote?.isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}>
        {quote ? quote.price : t("empty")}
      </span>
    </div>
  );
}
