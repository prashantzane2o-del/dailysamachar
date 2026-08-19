import type { MetadataRoute } from "next";

// Note: Ensure you import your actual routing config where locales are defined
// Assuming it is located at "@/i18n/routing" based on your middleware.ts
import { routing } from "@/i18n/routing"; 

// Use environment variables for the domain (Fallback for local dev)
const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Base Static Routes
  const staticRoutes = routing.locales.flatMap((locale) => [
    { url: `${origin}/${locale}`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${origin}/${locale}/fact-check`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${origin}/${locale}/weather`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${origin}/${locale}/markets`, lastModified: now, changeFrequency: "hourly" as const, priority: 0.8 },
  ]);

  // 2. Dynamic Categories Navigation
  const categories = ["india", "world", "politics", "business", "technology", "sports", "opinion"];
  const categoryRoutes = routing.locales.flatMap((locale) =>
    categories.map((category) => ({
      url: `${origin}/${locale}/category/${category}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // 3. Dynamic Article Routes (CMS Integration as per Architecture Rule 13.2)
  // TODO: Import your CMS service, e.g., `import { getRecentArticles } from "@/services/news";`
  // const recentArticles = await getRecentArticles();
  // const articleRoutes = recentArticles.map((article) => ({
  //   url: `${origin}/${article.locale}/news/${article.slug}`,
  //   lastModified: article.updatedAt,
  //   changeFrequency: "never" as const,
  //   priority: 0.7,
  // }));
  
  const articleRoutes: MetadataRoute.Sitemap = []; // Remove this once CMS is integrated

  // Combine all routes into the final sitemap
  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}