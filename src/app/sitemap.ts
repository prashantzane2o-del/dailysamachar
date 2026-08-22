import type { MetadataRoute } from "next";
import { cmsClient } from "@/shared/api/cms";
import { routing } from "@/i18n/routing";

const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org";

function localizedPath(locale: string, path: string): string {
  return locale === routing.defaultLocale ? path : "/" + locale + path;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ["/", "/fact-check", "/weather", "/markets", "/search"];
  const [categories, posts] = await Promise.all([
    cmsClient.getCategories().catch((error: unknown) => {
      console.error("Failed to build category sitemap entries", error);
      return [];
    }),
    cmsClient.getPostSitemapEntries().catch((error: unknown) => {
      console.error("Failed to build article sitemap entries", error);
      return [];
    }),
  ]);

  const staticRoutes = routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: origin + localizedPath(locale, path),
      lastModified: now,
      changeFrequency: path === "/weather" || path === "/markets" ? "hourly" as const : "daily" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
  );
  const categoryRoutes = routing.locales.flatMap((locale) =>
    categories.map((category) => ({
      url: origin + localizedPath(locale, "/category/" + category.slug),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  );
  const articleRoutes = routing.locales.flatMap((locale) =>
    posts.map((article) => ({
      url: origin + localizedPath(locale, "/news/" + article.slug),
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
