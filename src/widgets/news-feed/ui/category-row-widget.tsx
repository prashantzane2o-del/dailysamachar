// src/widgets/news-feed/ui/category-row-widget.tsx
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { BookOpenText, BriefcaseBusiness, Cpu, Film, Globe2, HeartPulse, Landmark, Newspaper, Sparkles, Trophy, Utensils } from "lucide-react";

const categoryIcons = {
  business: BriefcaseBusiness,
  entertainment: Film,
  lifestyle: Sparkles,
  sports: Trophy,
  technology: Cpu,
  health: HeartPulse,
  world: Globe2,
  national: Landmark,
  food: Utensils,
  opinion: BookOpenText,
} as const;

export interface CategoryRowWidgetProps {
  categorySlug: string;
  title: string;
  locale: string;
}

export async function CategoryRowWidget({ categorySlug, title, locale }: CategoryRowWidgetProps) {
  // Fetch slightly more articles (e.g., 6) so the slider has enough items to scroll
  const articles = await cmsApi.getArticlesByCategory(categorySlug, 1, 6).catch(() => []);
  const headingId = `category-heading-${categorySlug}`;
  const CategoryIcon = categoryIcons[categorySlug.trim().toLowerCase() as keyof typeof categoryIcons] || Newspaper;

  if (articles.length === 0) {
    return null; // Don't show empty category rows on the homepage to keep it clean
  }

  return (
    <section className="w-full py-6" aria-labelledby={headingId}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="border-line mb-6 flex items-end justify-between border-b-2 pb-3">
          <h2
            id={headingId}
            className="brand-section-heading text-ink flex items-center gap-3 text-2xl font-black tracking-wide uppercase md:text-3xl"
          >
            <span className="bg-signal text-white inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm" aria-hidden="true">
              <CategoryIcon className="h-4 w-4" />
            </span>
            {title}
          </h2>

          <Link
            href={`/category/${categorySlug}`}
            className="group text-signal hover:text-ink focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`View all news in ${title}`}
          >
            View All
            <ArrowRight
              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Horizontal Slider Layout */}
        <div
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pt-2 pb-6 sm:gap-6"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} stories`}
        >
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="w-[85vw] shrink-0 snap-start sm:w-[320px] lg:w-90"
              role="group"
              aria-roledescription="slide"
              aria-label={`Story ${index + 1} of ${articles.length}`}
            >
              <ArticleCard article={article} isHindi={locale === "hi"} />
            </div>
          ))}

          {/* View More Card at the end of the category slider */}
          {articles.length >= 4 && (
            <div className="flex w-50 shrink-0 snap-start items-center justify-center sm:w-62.5">
              <Link
                href={`/category/${categorySlug}`}
                className="group text-muted hover:text-signal flex flex-col items-center justify-center gap-3 transition-colors"
              >
                <span className="bg-soft border-line group-hover:border-signal flex h-14 w-14 items-center justify-center rounded-full border transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold tracking-wider uppercase">View All</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
