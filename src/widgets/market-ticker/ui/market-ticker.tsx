import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getGoldSilverRates } from "@/services/markets";
import { getTranslations } from "next-intl/server";

export async function MarketTicker() {
  const t = await getTranslations("markets");

  try {
    const metalRates = await getGoldSilverRates();

    if (!metalRates || metalRates.length === 0) {
      return null;
    }

    return (
      <div
        className="flex items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-1 text-xs md:px-0"
        aria-label={t("tickerLabel")}
        role="region"
      >
        {metalRates.map((item) => {
          const isUp = item.isUp;
          
          return (
            <div
              key={item.id}
              className="flex items-center gap-2 font-bold uppercase tracking-wider"
            >
              <span className="text-muted">
                {item.label} <span className="text-[10px] font-medium opacity-80">({item.unit})</span>
              </span>
              <span className="text-ink font-extrabold">{item.price}</span>
              <span
                className={`flex items-center text-[11px] font-semibold ${
                  isUp ? "text-emerald-600 dark:text-emerald-400" : "text-signal"
                }`}
                // Screen reader announcement for the visual arrow
                aria-label={isUp ? t("trendUp") : t("trendDown")}
                title={isUp ? t("trendUp") : t("trendDown")}
              >
                {isUp ? (
                  <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" aria-hidden="true" />
                )}
                {item.change}
              </span>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    // Graceful degradation: Prevent the entire header from crashing if the market API is down
    return null;
  }
}