import type { Metadata } from "next";
import { getLocalizedPath } from "@/i18n/path";
import type { Locale } from "@/i18n/routing";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");

export function getStaticPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = getLocalizedPath(locale, path);
  const englishPath = getLocalizedPath("en", path);
  const hindiPath = getLocalizedPath("hi", path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: englishPath,
        hi: hindiPath,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "DailySamachar",
      type: "website",
      locale: locale === "hi" ? "hi_IN" : "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export { siteUrl };
