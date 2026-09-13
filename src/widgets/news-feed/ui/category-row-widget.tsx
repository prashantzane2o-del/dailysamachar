// src/widgets/news-feed/ui/category-row-widget.tsx
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export interface CategoryRowWidgetProps {
  categorySlug: string;
  title: string;
  locale: string;
}

export async function CategoryRowWidget({ categorySlug, title, locale }: CategoryRowWidgetProps) {
  // Fetch articles safely
  const articles = await cmsApi.getArticlesByCategory(categorySlug, 1, 4).catch(() => []);
  const headingId = `category-heading-${categorySlug}`;

  return (
    <section className="border-line w-full border-t py-10" aria-labelledby={headingId}>
      <div className="mb-6 flex items-center justify-between">
        <h2
          id={headingId}
          className="editorial text-ink flex items-center gap-3 text-2xl font-bold tracking-wide uppercase"
        >
          <span className="bg-signal inline-block h-6 w-3" aria-hidden="true"></span>
          {title}
        </h2>

        {/* Sirf tabhi "View All" link dikhayen jab articles hon */}
        {articles.length > 0 && (
          <Link
            href={`/category/${categorySlug}`}
            className="group text-signal hover:text-ink focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`View all news in ${title}`}
          >
            View All
            <ArrowRight
              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} isHindi={locale === "hi"} />
          ))}
        </div>
      ) : (
        // FIXED: Show empty state instead of disappearing completely
        <div className="border-line bg-soft text-muted w-full rounded-xl border border-dashed p-8 text-center text-sm font-medium">
          No articles found in {title} yet.
        </div>
      )}
    </section>
  );
}
