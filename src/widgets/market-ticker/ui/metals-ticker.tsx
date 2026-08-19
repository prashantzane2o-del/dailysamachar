"use client";

import { ArrowDownRight, ArrowUpRight, Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
type CommodityResponse = { data: Array<{ symbol: "XAU" | "XAG"; name: string; currency: string; price: number; change: number; changePercent: number }> };

function MetalsLoading() { return <div className="h-5 w-64 animate-pulse rounded bg-soft" aria-label="Loading commodity prices" />; }

export function MetalsTicker() {
  const t = useTranslations("markets");
  const [result, setResult] = useState<CommodityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/markets/commodities", { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        const payload = await response.json() as CommodityResponse | { data: CommodityResponse };
        if (!response.ok && !("data" in payload)) throw new Error("Commodity prices unavailable");
        return ("data" in payload && !Array.isArray(payload.data) ? payload.data : payload) as CommodityResponse;
      })
      .then(setResult)
      .catch((error: unknown) => { if ((error as Error).name !== "AbortError") setResult(null); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <MetalsLoading />;
  if (!result?.data?.length) return <div className="flex items-center gap-2 text-xs text-muted" role="status"><Coins className="h-4 w-4" aria-hidden="true" />{t("empty")}</div>;
  const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
  return <div className="flex items-center gap-5 overflow-x-auto whitespace-nowrap text-xs" role="region" aria-label={t("tickerLabel")}><Coins className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />{result.data.map((quote) => { const up = quote.change >= 0; return <div className="flex items-center gap-2" key={quote.symbol}><span className="font-bold">{quote.name}</span><span className="text-muted">{quote.currency} {formatter.format(quote.price)}</span><span className={up ? "text-emerald-600" : "text-red-600"} aria-label={up ? t("trendUp") : t("trendDown")}>{up ? <ArrowUpRight className="inline h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="inline h-3.5 w-3.5" aria-hidden="true" />}{formatter.format(Math.abs(quote.changePercent))}%</span></div>; })}</div>;
}
