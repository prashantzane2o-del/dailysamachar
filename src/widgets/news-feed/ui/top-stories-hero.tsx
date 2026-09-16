// src/widgets/news-feed/ui/top-stories-hero.tsx
import { FeatureCard, HorizontalCard } from "@/components/cards/card-system";
import type { Article } from "@/types/news";

export interface TopStoriesHeroProps {
  articles: Article[];
}

export function TopStoriesHero({ articles }: TopStoriesHeroProps) {
  if (!articles || articles.length === 0) return null;

  const mainStory = articles[0];
  // Next 4 stories for the side list
  const sideStories = articles.slice(1, 5);

  return (
    <section className="w-full pt-6 pb-2" aria-label="Top Stories">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Main Large Featured Story (Left Side) */}
          <div className="lg:col-span-8">
            <FeatureCard article={mainStory} size="lg" />
          </div>

          {/* Side Stories List (Right Side) */}
          {sideStories.length > 0 && (
            <div className="flex flex-col gap-4 lg:col-span-4">
              <div className="border-line border-b-2 pb-2">
                <h2 className="text-ink flex items-center gap-2 text-lg font-black tracking-wide uppercase">
                  <span className="bg-signal inline-block h-4 w-2" aria-hidden="true"></span>
                  Top Stories
                </h2>
              </div>
              
              <div className="flex flex-col gap-1">
                {sideStories.map((story) => (
                  <HorizontalCard key={story.id} article={story} compact />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}