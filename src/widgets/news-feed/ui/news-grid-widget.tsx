// src/widgets/news-feed/ui/news-grid-widget.tsx
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";

export interface NewsGridWidgetProps {
  title?: string;
  articles?: Article[];
  viewAllLink?: string;
}

export function NewsGridWidget({ title = "Latest News", articles = [], viewAllLink = "/latest" }: NewsGridWidgetProps) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <section className="w-full py-8" aria-labelledby={`grid-heading-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading: Theme Synced using variable tokens */}
        <div className="border-line mb-6 flex items-center justify-between border-b-2 pb-2">
          <h2
            id={`grid-heading-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-ink flex items-center gap-3 text-2xl font-bold tracking-wide uppercase"
          >
            <span className="bg-signal inline-block h-6 w-3" aria-hidden="true"></span>
            {title}
          </h2>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-signal hover:text-ink focus-visible:ring-signal text-sm font-bold transition-colors outline-none focus-visible:rounded-sm focus-visible:ring-2"
              aria-label={`View all stories in ${title}`}
            >
              View All &raquo;
            </Link>
          )}
        </div>

        {/* Grid Layout for Articles */}
        {safeArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {safeArticles.map((article, index) => (
              <ArticleCard key={article.id || `article-${index}`} article={article} />
            ))}
          </div>
        ) : (
          /* AAA Accessibility: Empty State */
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
            <p className="text-muted max-w-sm">
              We couldn&apos;t load the articles for this section. Please check your API connection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
