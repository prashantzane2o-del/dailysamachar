import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function BreakingTicker() {
  return (
    <div 
      className="border-b border-line bg-signal text-white" 
      role="region" 
      aria-label="Breaking News"
    >
      <div className="container-page flex items-center">
        <div className="flex h-10 items-center bg-ink px-4 text-xs font-bold uppercase tracking-widest text-paper">
          Breaking
        </div>
        <div className="flex-1 overflow-hidden px-4">
          <p className="truncate text-sm font-medium">
            <Link 
              href="/news/election-results-live" 
              className="rounded-sm transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-signal"
            >
              Live Updates: Key constituencies report unexpected voter turnout in early phases 
              <ArrowRight className="ml-1 mb-0.5 inline-block h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}