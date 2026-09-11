import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function BreakingTicker() {
  return (
    <div className="border-line bg-signal border-b text-white" role="region" aria-label="Breaking News">
      <div className="container-page flex items-center">
        <div className="bg-ink text-paper flex h-10 items-center px-4 text-xs font-bold tracking-widest uppercase">
          Breaking
        </div>
        <div className="flex-1 overflow-hidden px-4">
          <p className="truncate text-sm font-medium">
            <Link
              href="/news/election-results-live"
              className="focus-visible:ring-offset-signal rounded-sm transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Live Updates: Key constituencies report unexpected voter turnout in early phases
              <ArrowRight className="mb-0.5 ml-1 inline-block h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
