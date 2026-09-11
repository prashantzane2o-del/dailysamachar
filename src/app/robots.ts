import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/profile",
          "/settings",
          "/bookmarks",
          "/notifications",
        ],
      },
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/news-sitemap.xml`],
  };
}
