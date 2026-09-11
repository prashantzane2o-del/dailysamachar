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
          className="bg-soft h-36 rounded-2xl motion-safe:animate-pulse"
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
      <article className="bg-soft rounded-2xl border p-5">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-muted mt-6 text-sm">{t("empty")}</p>
      </article>
    );
  }

  const isDown = quote.change < 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper rounded-2xl border p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold">{label}</p>
        {quote.isPositive ? (
          <TrendingUp size={18} className="text-emerald-800 dark:text-emerald-300" aria-hidden="true" />
        ) : isDown ? (
          <TrendingDown size={18} className="text-red-800 dark:text-red-300" aria-hidden="true" />
        ) : null}
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight">{number(locale, quote.price)}</p>
      <p
        className={
          "mt-2 text-sm font-semibold " +
          (quote.isPositive
            ? "text-emerald-800 dark:text-emerald-300"
            : isDown
              ? "text-red-800 dark:text-red-300"
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
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">{t("error")}</p>
        <button
          type="button"
          onClick={() => {
            void indicesQuery.refetch();
            void commoditiesQuery.refetch();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-800 px-3 py-2 text-sm font-bold text-white"
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
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
      <span>{t("sensex")}</span>
      <span>{quote ? quote.price : t("empty")}</span>
    </div>
  );
}
