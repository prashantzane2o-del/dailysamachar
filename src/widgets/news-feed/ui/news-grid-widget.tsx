// src/widgets/news-feed/ui/news-grid-widget.tsx

import { ArticleCard } from '@/entities/article/ui/article-card';
import { Link } from '@/i18n/navigation';
import type { Article } from '@/types/news';

export interface NewsGridWidgetProps {
  title?: string;
  articles?: Article[]; 
  viewAllLink?: string;
}

export function NewsGridWidget({ 
  title = "Latest News", 
  articles = [], 
  viewAllLink = "/latest" 
}: NewsGridWidgetProps) {
  // Safe array check
  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <section 
      className="py-8 w-full"
      aria-labelledby={`grid-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Theme Synced (Deep Navy) */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-brand-primary dark:border-gray-700 pb-2">
          <h2 
            id={`grid-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-2xl font-bold uppercase tracking-wide text-brand-primary dark:text-gray-100 flex items-center gap-3"
          >
            {/* Brand Red Accent Box */}
            <span className="w-3 h-6 bg-brand-accent inline-block" aria-hidden="true"></span>
            {title}
          </h2>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-sm font-bold text-brand-accent hover:text-brand-primary dark:hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:rounded-sm"
              aria-label={`View all stories in ${title}`}
            >
              View All &raquo;
            </Link>
          )}
        </div>

        {/* Grid Layout for Articles */}
        {safeArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeArticles.map((article, index) => (
              // FIXED: Passed the entire article object directly, eliminating TS errors for missing fields
              <ArticleCard
                key={article.id || `article-${index}`}
                article={article}
              />
            ))}
          </div>
        ) : (
          /* AAA Accessibility: Empty State UI needs role="status" and aria-live */
          <div 
            role="status" 
            aria-live="polite"
            className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              We couldn't load the articles for this section. Please check your API connection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}