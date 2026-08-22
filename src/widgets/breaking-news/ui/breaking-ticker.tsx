import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function BreakingTicker() {
  // Server-side translation fetch
  const t = await getTranslations("breakingNews");

  // This bounded fallback keeps the ticker stable until a breaking-news CMS field is available.
  const activeBreakingNews = {
    href: "/news/election-results-live",
    headline: "Live Updates: Key constituencies report unexpected voter turnout in early phases",
  };

  // If no breaking news is active, do not render the region at all
  if (!activeBreakingNews) return null;

  return (
    <div
      className="border-b border-line bg-signal text-white"
      role="region"
      aria-label={t("regionLabel")} // Localized: e.g., "Breaking News Ticker"
    >
      <div className="container-page flex items-center">
        {/* Visual label for sighted users, hidden from SR to avoid redundancy with region label */}
        <div 
          className="flex h-10 items-center bg-ink px-4 text-xs font-bold uppercase tracking-widest text-paper"
          aria-hidden="true"
        >
          {t("label")}
        </div>
        
        <div className="flex-1 overflow-hidden px-4">
          <p className="truncate text-sm font-medium">
            <Link
              href={activeBreakingNews.href}
              className="rounded-sm transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-signal"
            >
              {activeBreakingNews.headline}
              <ArrowRight className="ml-1 mb-0.5 inline-block h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
