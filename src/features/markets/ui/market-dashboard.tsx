"use client";

import { motion } from "framer-motion";
import { RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMarkets } from "@/services/markets/hooks/use-markets";
import type { MarketQuote } from "@/services/markets";

const number = (locale: string, value: number) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

const symbols = ["SENSEX", "NIFTY50", "BANKNIFTY", "GOLD", "SILVER", "USDINR", "BTC", "ETH"] as const;

function MarketSkeleton() {
  const t = useTranslations("common");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {symbols.map((symbol) => (
        <div aria-label={t("loading")} className="bg-soft h-36 animate-pulse rounded-2xl" key={symbol} />
      ))}
    </div>
  );
}

function MarketCard({ quote, label }: { quote?: MarketQuote; label: string }) {
  const locale = useLocale();
  const t = useTranslations("markets");
  if (!quote)
    return (
      <article className="bg-soft rounded-2xl border p-5">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-muted mt-6 text-sm">{t("empty")}</p>
      </article>
    );
  const positive = quote.direction === "up";
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper rounded-2xl border p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold">{label}</p>
        {positive ? (
          <TrendingUp size={18} className="text-emerald-600" aria-hidden="true" />
        ) : quote.direction === "down" ? (
          <TrendingDown size={18} className="text-red-600" aria-hidden="true" />
        ) : null}
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight">{number(locale, quote.value)}</p>
      <p
        className={`mt-2 text-sm font-semibold ${positive ? "text-emerald-600" : quote.direction === "down" ? "text-red-600" : "text-muted"}`}
      >
        {quote.change > 0 ? "+" : ""}
        {number(locale, quote.change)} ({quote.changePercent > 0 ? "+" : ""}
        {number(locale, quote.changePercent)}%)
      </p>
      <p className="text-muted mt-4 text-xs">{t("futureChart")}</p>
    </motion.article>
  );
}

export function MarketDashboard({ initialData }: { initialData?: MarketQuote[] }) {
  const t = useTranslations("markets");
  const common = useTranslations("common");
  const query = useMarkets(initialData);
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
  if (query.isLoading) return <MarketSkeleton />;
  if (query.isError)
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">{t("error")}</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white"
        >
          <RotateCcw size={15} />
          {common("retry")}
        </button>
      </div>
    );
  const quotes = query.data ?? [];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {symbols.map((symbol, index) => (
        <MarketCard key={symbol} quote={quotes.find((quote) => quote.symbol === symbol)} label={labels[index]} />
      ))}
    </div>
  );
}

export function MarketTicker({ initialData }: { initialData?: MarketQuote[] }) {
  const t = useTranslations("markets");
  const query = useMarkets(initialData);
  const quote = query.data?.[0];
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
      <span>{t("sensex")}</span>
      <span>{quote ? quote.value : t("empty")}</span>
    </div>
  );
}
