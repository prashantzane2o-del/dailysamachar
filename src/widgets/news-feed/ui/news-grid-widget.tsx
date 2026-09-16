// src/widgets/news-feed/ui/news-grid-widget.tsx
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface NewsGridWidgetProps {
  title?: string;
  articles?: Article[];
  viewAllLink?: string;
  className?: string; // To fix double padding issues from parent wrappers
  hideIfEmpty?: boolean; // To prevent ugly gray boxes on the homepage
}

export function NewsGridWidget({
  title = "Latest News",
  articles = [],
  viewAllLink,
  className = "w-full py-8",
  hideIfEmpty = true,
}: NewsGridWidgetProps) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  // MISTAKE 7 FIX: Gracefully hide the entire section if no articles exist
  if (safeArticles.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    <section className={cn(className)} aria-labelledby={`grid-heading-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with View All */}
        <div className="border-line mb-6 flex items-end justify-between border-b-2 pb-3">
          <h2
            id={`grid-heading-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-ink flex items-center gap-3 text-2xl font-black tracking-wide uppercase md:text-3xl"
          >
            <span className="bg-signal inline-block h-6 w-3" aria-hidden="true"></span>
            {title}
          </h2>

          {/* Header Link always visible if provided and articles exist */}
          {viewAllLink && safeArticles.length > 0 && (
            <Link
              href={viewAllLink}
              className="group text-signal hover:text-ink focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label={`View all stories in ${title}`}
            >
              View All
              <ArrowRight
                className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        {/* Horizontal Slider Layout */}
        {safeArticles.length > 0 ? (
          <div
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pt-2 pb-6 sm:gap-6"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${title} stories`}
          >
            {safeArticles.map((article, index) => (
              <div
                key={article.id || `article-${index}`}
                className="w-[85vw] shrink-0 snap-start sm:w-80 lg:w-90"
                role="group"
                aria-roledescription="slide"
                aria-label={`Story ${index + 1} of ${safeArticles.length}`}
              >
                <ArticleCard article={article} />
              </div>
            ))}

            {/* View More Card at the end of the slider */}
            {/* MISTAKE 5 FIX: Only show end card if there's a heavy scroll load (5+ articles) */}
            {viewAllLink && safeArticles.length >= 5 && (
              <div className="flex w-50 shrink-0 snap-start items-center justify-center sm:w-62.5">
                <Link
                  href={viewAllLink}
                  className="group text-muted hover:text-signal flex flex-col items-center justify-center gap-3 transition-colors"
                >
                  <span className="border-line bg-soft group-hover:border-signal flex h-14 w-14 items-center justify-center rounded-full border transition-colors">
                    <ArrowRight className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-bold tracking-wider uppercase">View All</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Fallback Empty State (Visible only if hideIfEmpty={false} via props) */
          <div
            role="status"
            aria-live="polite"
            className="bg-soft border-line flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12 text-center"
          >
            <div className="bg-paper mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow-sm">
              <svg
                className="text-muted h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20"
                />
              </svg>
            </div>
            <h3 className="text-ink mb-1 text-lg font-bold">No articles found</h3>
            <p className="text-muted max-w-sm">We couldn&apos;t load the articles for this section.</p>
          </div>
        )}
      </div>
    </section>
  );
}
