// src/app/[locale]/page.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";

// UI Widgets
import { BreakingTicker } from "@/widgets/breaking-news";
import { MetalsTicker } from "@/widgets/market-ticker/ui/metals-ticker";
import { WeatherTicker } from "@/widgets/weather/ui/weather-ticker";
import { HeroStoryWidget } from "@/widgets/news-feed/ui/hero-story-widget";
import { NewsGridWidget } from "@/widgets/news-feed/ui/news-grid-widget";
import { CategoryRowWidget } from "@/widgets/news-feed/ui/category-row-widget";
import { WebStoriesSlider } from "@/widgets/news-feed/ui/web-stories-slider";
import { OpinionEditorialWidget } from "@/widgets/news-feed/ui/opinion-editorial-widget";
import { MultimediaGallery } from "@/widgets/media/ui/multimedia-gallery";
import { AdSlot } from "@/widgets/ads/ad-slot";
import { NewsGridSkeleton } from "@/widgets/shared/ui/skeleton-loaders";
import { NewsletterCard } from "@/components/widgets/widgets";

export interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });

  return {
    title: t("title", { fallback: "DailySamachar | Latest News" }),
    description: t("description", { fallback: "Verified, independent news." }),
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: { en: "/", hi: "/hi" },
    },
    openGraph: {
      type: "website",
      locale: locale === "hi" ? "hi_IN" : "en_IN",
      siteName: "DailySamachar",
    },
  };
}

// 1. Opinion & Editorial Feed (Optimized: No fallbacks to avoid duplication loops)
async function OpinionFeed() {
  const opinionArticles = await cmsApi.getArticlesByCategory("opinion", 1, 3).catch(() => []);
  if (opinionArticles.length === 0) return null;
  return <OpinionEditorialWidget sectionTitle="Opinion & Analysis" articles={opinionArticles} />;
}

// 2. Multimedia / Videos Feed (Optimized: No fallbacks)
async function MultimediaFeed() {
  const mediaArticles = await cmsApi.getArticlesByCategory("video", 1, 5).catch(() => []);
  if (mediaArticles.length === 0) return null;
  return <MultimediaGallery sectionTitle="In Focus: Photos & Videos" articles={mediaArticles} />;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  // Keep one primary latest-news rail, then show category-specific rails below it.
  const [breakingArticles, allCategories, latestArticles] = await Promise.all([
    cmsApi.getArticlesByCategory("breaking", 1, 5).catch(() => []),
    cmsApi.getCategories().catch(() => []),
    cmsApi.getLatestArticles(15).catch(() => []),
  ]);

  const heroStories = latestArticles.slice(0, 5);
  const latestRailArticles = latestArticles.slice(5);

  // Render every non-utility category returned by WordPress. The homepage used
  // to slice this list to five items, which silently hid the remaining CMS
  // categories even though the API returned them successfully.
  const excludedSlugs = new Set(["uncategorized", "web-stories", "webstories", "breaking", "breaking-news"]);
  const validCategories = allCategories.filter(
    (cat) => cat.slug && !excludedSlugs.has(cat.slug.trim().toLowerCase()),
  );
  const hasLifestyleCategory = validCategories.some((cat) => cat.slug.trim().toLowerCase() === "lifestyle");

  return (
    <div className="flex w-full flex-col pb-12">
      {/* Breaking News Ticker ONLY shows if actual breaking news exists */}
      {breakingArticles.length > 0 && <BreakingTicker articles={breakingArticles} />}

      {/* Top Utility Widgets */}
      <section
        aria-label="Live Market and Weather"
        className="border-line container mx-auto mt-2 flex flex-col justify-between gap-3 border-b px-4 pb-4 sm:px-6 sm:pb-6 md:flex-row lg:px-8"
      >
        <div className="flex max-w-full min-w-0 md:flex-1">
          <MetalsTicker />
        </div>
        <div className="flex max-w-full min-w-0 md:flex-1 md:justify-end">
          <WeatherTicker />
        </div>
      </section>

      <main className="flex w-full flex-col" role="main">
        {/* Hidden H1 for SEO and Accessibility */}
        <h1 className="sr-only">Daily Samachar - Top Headlines and Latest News</h1>

        {/* Featured hero carousel using the same latest-news response */}
        <HeroStoryWidget stories={heroStories} sectionTitle="Latest Headlines" />

        {/* One primary horizontal latest-news rail */}
        <NewsGridWidget
          title={t("title", { fallback: "Latest News" })}
          articles={latestRailArticles}
          viewAllLink="/latest"
          hideIfEmpty={false}
        />

        {/* Category-specific horizontal rails */}
        {validCategories.map((cat, index) => (
          <React.Fragment key={cat.id}>
            <Suspense fallback={<NewsGridSkeleton count={4} />}>
              <CategoryRowWidget categorySlug={cat.slug} title={cat.title} locale={locale} />
            </Suspense>
            {/* Keep Web Stories directly below the Lifestyle rail when that category exists. */}
            {cat.slug.trim().toLowerCase() === "lifestyle" && (
              <Suspense fallback={<div className="bg-soft mx-auto my-6 h-96 w-full animate-pulse" />}>
                <WebStoriesSlider locale={locale} />
              </Suspense>
            )}
            {/* Insert Newsletter & Ad Card perfectly after the FIRST category row */}
            {index === 0 && (
              <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <NewsletterCard />
                <div className="mt-8">
                  <AdSlot placement="inline" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Fallback for installations where the Lifestyle category is not configured yet. */}
        {!hasLifestyleCategory && (
          <Suspense fallback={<div className="bg-soft mx-auto my-6 h-96 w-full animate-pulse" />}>
            <WebStoriesSlider locale={locale} />
          </Suspense>
        )}
      </main>

      {/* Section 6: Multimedia Section */}
      <Suspense fallback={<div className="bg-soft h-96 w-full animate-pulse" />}>
        <MultimediaFeed />
      </Suspense>

      {/* Section 7: Opinion Section */}
      <Suspense fallback={<div className="bg-soft h-64 w-full animate-pulse" />}>
        <OpinionFeed />
      </Suspense>
    </div>
  );
}
