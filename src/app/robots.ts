import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
  const privatePaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/profile",
    "/settings",
    "/bookmarks",
    "/notifications",
    "/hi/login",
    "/hi/signup",
    "/hi/forgot-password",
    "/hi/reset-password",
    "/hi/profile",
    "/hi/settings",
    "/hi/bookmarks",
    "/hi/notifications",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...privatePaths],
      },
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/news-sitemap.xml`],
  };
}
