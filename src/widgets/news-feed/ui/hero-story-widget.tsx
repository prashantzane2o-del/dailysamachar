// src/widgets/news-feed/ui/hero-story-widget.tsx

import { ArticleCard } from '@/entities/article/ui/article-card';
import { Link } from '@/i18n/navigation';
import type { Article } from '@/types/news';

export interface HeroStoryWidgetProps {
  // FIXED: Removed local 'Story' interface and used strict 'Article' type
  mainStory?: Article | null;
  sideStories?: Article[];
  sectionTitle?: string;
}

export function HeroStoryWidget({ 
  mainStory, 
  sideStories = [], // Default to empty array
  sectionTitle = "Top Stories" 
}: HeroStoryWidgetProps) {
  // FAIL-SAFE: Agar mainStory data server se nahi aaya, toh component crash nahi hoga, null return karega.
  if (!mainStory) {
    return null; 
  }

  // Ensure sideStories is always an array
  const safeSideStories = Array.isArray(sideStories) ? sideStories : [];

  return (
    <section 
      className="py-8 w-full"
      aria-labelledby="hero-section-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-brand-primary dark:border-gray-700 pb-2">
          <h2 
            id="hero-section-heading" 
            className="text-2xl font-bold uppercase tracking-wide text-brand-primary dark:text-gray-100 flex items-center gap-3"
          >
            <span className="w-3 h-6 bg-brand-accent inline-block" aria-hidden="true"></span>
            {sectionTitle}
          </h2>

          <Link 
            href="/latest" 
            className="text-sm font-bold text-brand-accent hover:text-brand-primary dark:hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:rounded-sm"
            aria-label={`View all ${sectionTitle.toLowerCase()} stories`}
          >
            View All &raquo;
          </Link>
        </div>

        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Lead Story */}
          <div className="lg:col-span-8">
            {/* FIXED: Passing the entire article object directly to the updated ArticleCard */}
            <ArticleCard article={mainStory} />
          </div>

          {/* Side Stories (Safe mapping) */}
          {safeSideStories.length > 0 && (
            <div 
              className="lg:col-span-4 flex flex-col gap-6" 
              role="feed" 
              aria-label="Related side stories"
            >
              {safeSideStories.slice(0, 2).map((story, index) => (
                <ArticleCard
                  key={story?.id || `side-story-${index}`}
                  article={story}
                />
              ))}
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}