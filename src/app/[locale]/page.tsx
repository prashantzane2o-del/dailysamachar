// src/app/[locale]/page.tsx

import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { cmsApi } from "@/shared/api/cms";

// UI Widgets (FSD)
import { MarketTicker } from "@/widgets/market-ticker/ui/market-ticker";
import { MetalsTicker } from "@/widgets/market-ticker/ui/metals-ticker";
import { WeatherWidget } from "@/widgets/weather/ui/weather-widget";
import { NewsGridWidget } from "@/widgets/news-feed/ui/news-grid-widget";
import { HeroStoryWidget } from "@/widgets/news-feed/ui/hero-story-widget";
import { OpinionEditorialWidget } from "@/widgets/news-feed/ui/opinion-editorial-widget";
import { MultimediaGallery } from "@/widgets/media/ui/multimedia-gallery";
import { TrendingCard } from "@/components/cards/card-system";
import { NewsGridSkeleton, HeroStorySkeleton } from "@/widgets/shared/ui/skeleton-loaders";
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
      <div role="status" aria-live="polite" className="col-span-full text-center text-slate-500 py-10">
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
    // Fetch specifically from opinion category
    opinionArticles = await cmsApi.getArticlesByCategory("opinion", 1, 3);
    // Fallback logic for safety
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
    // Fetch specifically from video category
    mediaArticles = await cmsApi.getArticlesByCategory("video", 1, 5);
    // Fallback logic for safety
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

  // Fetch trending safely for the aside bar
  const trendingArticles = await cmsApi.getFeaturedArticles(5).catch(() => []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Top Utility Widgets */}
      <section
        aria-label={t("markets", { fallback: "Markets" })}
        className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 grid grid-cols-1 gap-6 border-b-2 border-slate-200 pb-6 md:grid-cols-2 dark:border-slate-800"
      >
        <div className="flex flex-col justify-center gap-4">
          <MarketTicker />
          {/* Missing Metals Ticker Added Here */}
          <div className="hidden sm:block">
            <MetalsTicker />
          </div>
        </div>
        <WeatherWidget city="New Delhi" />
      </section>

      {/* Hero Section */}
      <Suspense fallback={<HeroStorySkeleton />}>
        <HeroFeed />
      </Suspense>

      {/* Main Content Layout */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* Non-blocking UI rendering using Suspense */}
          <Suspense fallback={<NewsGridSkeleton count={6} />}>
            <LatestNewsFeed locale={locale} />
          </Suspense>
        </div>

        {/* Sidebar / Trending */}
        <aside
          aria-labelledby="trending-heading"
          className="space-y-8 lg:col-span-4 pt-8"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
            <h2 id="trending-heading" className="mb-4 text-xl font-bold uppercase tracking-wide text-brand-primary dark:text-gray-100 flex items-center gap-3">
              <span className="w-2 h-5 bg-brand-accent inline-block" aria-hidden="true"></span>
              {t("moreLatest", { fallback: "Trending News" })}
            </h2>

            <div className="flex flex-col gap-4">
              {trendingArticles.length > 0 ? (
                trendingArticles.map((article, idx) => (
                  <TrendingCard key={article.id} rank={idx + 1} article={article} />
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400" role="status">
                  {t("temporaryUnavailable", { fallback: "Currently unavailable." })}
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Multimedia Section */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-200 dark:bg-slate-900" />}>
        <MultimediaFeed />
      </Suspense>

      {/* Opinion Section */}
      <Suspense fallback={<div className="h-64 w-full animate-pulse bg-slate-100 dark:bg-slate-800" />}>
        <OpinionFeed />
      </Suspense>

    </div>
  );
}