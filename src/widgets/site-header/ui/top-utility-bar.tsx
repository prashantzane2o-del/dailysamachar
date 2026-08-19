import { useLocale } from "next-intl";
import { LiveClock } from "@/features/clock/ui/live-clock";
import { MarketTicker } from "@/widgets/market-ticker/ui/market-ticker";
import { WeatherUtilityBar } from "@/widgets/weather/weather-utility-bar";
import type { Locale } from "@/i18n/routing";

// Hydration-safe client component
import { CurrentDate } from "./current-date"; 

export function TopUtilityBar() {
  const locale = useLocale();

  return (
    <div className="border-b border-line bg-soft text-ink">
      <div className="container-page flex min-h-10 flex-col justify-between divide-y divide-line text-xs font-semibold tracking-wide md:flex-row md:items-center md:divide-x md:divide-y-0">
        
        {/* Left: Date, Time & Weather */}
        <div className="flex flex-wrap items-center gap-4 py-2 pr-4">
          {/* 1. Replaced static date with Client Island */}
          <CurrentDate />
          
          <span aria-hidden="true" className="hidden text-line md:inline">|</span>
                    
          <LiveClock locale={locale} />
          
          <span aria-hidden="true" className="hidden text-line md:inline">|</span>
                    
          <WeatherUtilityBar locale={locale as Locale} />
        </div>

        {/* Right: Financial Market Ticker */}
        <div className="flex-1 overflow-hidden py-2 pl-0 md:pl-4" role="region" aria-label="Market Overview">
          <MarketTicker />
        </div>

      </div>
    </div>
  );
}