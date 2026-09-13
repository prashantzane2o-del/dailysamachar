// src/app/[locale]/page.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";

// UI Widgets (FSD)
import { BreakingTicker } from "@/widgets/breaking-news";
import { MetalsTicker } from "@/widgets/market-ticker/ui/metals-ticker";
import { WeatherWidget } from "@/widgets/weather/ui/weather-widget";
import { NewsGridWidget } from "@/widgets/news-feed/ui/news-grid-widget";
import { HeroStoryWidget } from "@/widgets/news-feed/ui/hero-story-widget";
import { OpinionEditorialWidget } from "@/widgets/news-feed/ui/opinion-editorial-widget";
import { MultimediaGallery } from "@/widgets/media/ui/multimedia-gallery";
import { CategoryRowWidget } from "@/widgets/news-feed/ui/category-row-widget";
import { AdSlot } from "@/widgets/ads/ad-slot";

import { TrendingCard } from "@/components/cards/card-system";
import { NewsGridSkeleton, HeroStorySkeleton } from "@/widgets/shared/ui/skeleton-loaders";
import { NewsletterCard } from "@/components/widgets/widgets";
import type { Article } from "@/types/news";

export interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });

  return {
    title: t("title", { fallback: "DailySamachar | Latest News" }),
    description: t("description", { fallback: "Verified, independent news." }),
  };
}

// 1. Hero Feed (Main Top Stories)
async function HeroFeed() {
  let featuredArticles: Article[] = [];
  try {
    featuredArticles = await cmsApi.getFeaturedArticles(5);
  } catch (error) {
    console.error("Failed to load featured articles", error);
  }

  if (featuredArticles.length === 0) return null;

  return (
    <HeroStoryWidget
      mainStory={featuredArticles[0]}
      sideStories={featuredArticles.slice(1, 5)}
      sectionTitle="Top Stories"
    />
  );
}

// 2. Latest News Grid
async function LatestNewsFeed({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  let latestArticles: Article[] = [];

  try {
    latestArticles = await cmsApi.getLatestArticles(6);
  } catch (error) {
    console.error("Failed to load latest articles", error);
  }

  if (latestArticles.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-muted bg-soft border-line col-span-full rounded-lg border border-dashed py-10 text-center"
      >
        {t("noNews", { fallback: "No news available at the moment." })}
      </div>
    );
  }

  return <NewsGridWidget title={t("title", { fallback: "Latest News" })} articles={latestArticles} />;
}

// 3. Opinion & Editorial Feed
async function OpinionFeed() {
  let opinionArticles: Article[] = [];
  try {
    opinionArticles = await cmsApi.getArticlesByCategory("opinion", 1, 3);
    if (opinionArticles.length === 0) {
      opinionArticles = await cmsApi.getLatestArticles(3);
    }
  } catch (error) {
    console.error("Failed to load opinion articles", error);
  }

  if (opinionArticles.length === 0) return null;

  return <OpinionEditorialWidget sectionTitle="Opinion & Analysis" articles={opinionArticles} />;
}

// 4. Multimedia / Videos Feed
async function MultimediaFeed() {
  let mediaArticles: Article[] = [];
  try {
    mediaArticles = await cmsApi.getArticlesByCategory("video", 1, 5);
    if (mediaArticles.length === 0) {
      mediaArticles = await cmsApi.getFeaturedArticles(5);
    }
  } catch (error) {
    console.error("Failed to load media articles", error);
  }

  if (mediaArticles.length === 0) return null;

  return <MultimediaGallery sectionTitle="In Focus: Photos & Videos" articles={mediaArticles} />;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  const [trendingArticles, breakingArticles, allCategories] = await Promise.all([
    cmsApi.getFeaturedArticles(5).catch(() => []),
    cmsApi.getArticlesByCategory("breaking", 1, 3).catch(() => []),
    cmsApi.getCategories().catch(() => []),
  ]);

  const validCategories = allCategories
    .filter((cat) => cat.slug && cat.slug.toLowerCase() !== "uncategorized")
    .slice(0, 3); // Get the top 3 categories dynamically

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Breaking News Ticker */}
      <BreakingTicker articles={breakingArticles.length > 0 ? breakingArticles : trendingArticles.slice(0, 3)} />

      {/* Top Utility Widgets (Exclusively Bullion & Weather) */}
      <section
        aria-label="Live Market and Weather"
        className="border-line container mx-auto mt-2 grid grid-cols-1 items-center gap-6 border-b px-4 pb-6 sm:px-6 md:grid-cols-2 lg:px-8"
      >
        <div className="flex min-w-0 flex-col justify-center">
          <MetalsTicker />
        </div>
        <div className="hidden md:block">
          <WeatherWidget city="New Delhi" />
        </div>
      </section>

      {/* Top Leaderboard Advertisement */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="top" className="my-2" />
      </div>

      {/* Hero Section */}
      <Suspense fallback={<HeroStorySkeleton />}>
        <HeroFeed />
      </Suspense>

      {/* Main Content Layout */}
      <main className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
          <Suspense fallback={<NewsGridSkeleton count={6} />}>
            <LatestNewsFeed locale={locale} />
          </Suspense>

          {/* Inline Advertisement */}
          <div className="w-full py-4">
            <AdSlot placement="inline" />
          </div>

          {/* DYNAMIC CATEGORY ROWS */}
          {validCategories.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <Suspense fallback={<NewsGridSkeleton count={4} />}>
                <CategoryRowWidget categorySlug={cat.slug} title={cat.title} locale={locale} />
              </Suspense>

              {/* Insert Newsletter Card perfectly after the FIRST category row */}
              {index === 0 && (
                <div className="w-full py-6">
                  <NewsletterCard />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Sidebar / Trending */}
        <aside aria-labelledby="trending-heading" className="space-y-8 pt-8 lg:col-span-4">
          {/* Sidebar Advertisement */}
          <AdSlot placement="sidebar" className="mb-8" />

          <div className="border-line bg-soft rounded-xl border p-6 shadow-sm">
            <h2
              id="trending-heading"
              className="text-ink mb-4 flex items-center gap-3 text-xl font-bold tracking-wide uppercase"
            >
              <span className="bg-signal inline-block h-5 w-2" aria-hidden="true"></span>
              {t("moreLatest", { fallback: "Trending News" })}
            </h2>
            <div className="flex flex-col gap-4">
              {trendingArticles.length > 0 ? (
                trendingArticles.map((article, idx) => (
                  <TrendingCard key={article.id} rank={idx + 1} article={article} />
                ))
              ) : (
                <p className="text-muted text-sm" role="status">
                  {t("temporaryUnavailable", { fallback: "Currently unavailable." })}
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Multimedia Section */}
      <Suspense fallback={<div className="bg-soft h-96 w-full animate-pulse" />}>
        <MultimediaFeed />
      </Suspense>

      {/* Opinion Section */}
      <Suspense fallback={<div className="bg-soft h-64 w-full animate-pulse" />}>
        <OpinionFeed />
      </Suspense>
    </div>
  );
}
