// src/widgets/news-feed/ui/hero-story-widget.tsx
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";

export interface HeroStoryWidgetProps {
  mainStory?: Article | null;
  sideStories?: Article[];
  sectionTitle?: string;
}

export function HeroStoryWidget({ mainStory, sideStories = [], sectionTitle = "Top Stories" }: HeroStoryWidgetProps) {
  if (!mainStory) {
    return null;
  }

  const safeSideStories = Array.isArray(sideStories) ? sideStories : [];

  return (
    <section className="w-full py-8" aria-labelledby="hero-section-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-line mb-6 flex items-center justify-between border-b-2 pb-2">
          <h2
            id="hero-section-heading"
            className="text-ink flex items-center gap-3 text-2xl font-bold tracking-wide uppercase"
          >
            <span className="bg-signal inline-block h-6 w-3" aria-hidden="true"></span>
            {sectionTitle}
          </h2>
          <Link
            href="/latest"
            className="text-signal hover:text-ink focus-visible:ring-signal text-sm font-bold transition-colors outline-none focus-visible:rounded-sm focus-visible:ring-2"
            aria-label={`View all ${sectionTitle.toLowerCase()} stories`}
          >
            View All &raquo;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Added size="lg" prop for hero card sizing if your ArticleCard supports it */}
            <ArticleCard article={mainStory} />
          </div>

          {safeSideStories.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-4" role="feed" aria-label="Related side stories">
              {safeSideStories.slice(0, 2).map((story, index) => (
                <ArticleCard key={story?.id || `side-story-${index}`} article={story} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
