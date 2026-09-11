"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useMarketData } from "@/entities/market/lib/use-market";
import type { MarketItem } from "@/entities/market/model/types";

function TickerItem({ item }: { item: MarketItem }) {
  return (
    <Link
      href="/markets"
      className="group flex cursor-pointer items-center gap-3 border-r border-gray-200 px-6 py-2 whitespace-nowrap transition-colors hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50"
    >
      <div className="flex flex-col">
        <span className="group-hover:text-signal text-xs font-bold text-gray-900 transition-colors dark:text-gray-100 dark:group-hover:text-red-300">
          {item.name}
        </span>
        <span className="text-[10px] tracking-wider text-gray-500 uppercase dark:text-gray-400">{item.symbol}</span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(item.price)}
        </span>
        <div
          className={
            item.isPositive
              ? "flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-500"
              : "flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-500"
          }
        >
          {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>
            {item.change > 0 ? "+" : ""}
            {item.change.toFixed(2)}
          </span>
          <span>
            ({item.percentChange > 0 ? "+" : ""}
            {item.percentChange.toFixed(2)}%)
          </span>
        </div>
      </div>
    </Link>
  );
}

export function MarketTicker() {
  const t = useTranslations("markets");
  const query = useMarketData("indices");
  const markets = query.data ?? [];
  const tickerItems = [...markets, ...markets, ...markets];

  if (query.isLoading) {
    return <div className="bg-soft border-line h-14 w-full animate-pulse border-b" aria-label="Loading markets" />;
  }

  return (
    <div className="relative z-30 flex h-14 w-full items-stretch overflow-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="z-10 hidden shrink-0 items-center justify-between border-r border-gray-200 bg-gray-50 px-4 sm:px-6 md:flex dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-widest text-gray-900 uppercase dark:text-white">
            {t("markets", { fallback: "Markets" })}
          </span>
          <span className="flex items-center text-[10px] font-bold text-green-600 dark:text-green-500">
            <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            {t("live", { fallback: "LIVE" })}
          </span>
        </div>
        <Link
          href="/markets"
          className="ml-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label={t("viewAllMarkets", { fallback: "View all markets" })}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative flex grow items-center overflow-hidden" role="marquee" aria-live="off">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-linear-to-r from-white to-transparent dark:from-black" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-linear-to-l from-white to-transparent dark:from-black" />
        <motion.div
          className="flex w-max items-center"
          animate={{ x: "-33.33%" }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
        >
          {tickerItems.map((item, index) => (
            <TickerItem key={item.symbol + "-" + index} item={item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
