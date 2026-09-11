import { getLocalizedPath } from "@/i18n/path";
import { safeJson } from "@/shared/lib/safe-json";

interface SiteSchemaProps {
  locale: string;
}

export function SiteSchema({ locale }: SiteSchemaProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
  const sitePath = getLocalizedPath(locale, "/");
  const searchPath = getLocalizedPath(locale, "/search");
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DailySamachar",
      url: `${baseUrl}${sitePath}`,
      logo: `${baseUrl}/Logo.svg`,
      description: "Verified, independent news from India and around the world.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "DailySamachar",
      url: `${baseUrl}${sitePath}`,
      inLanguage: locale,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}${searchPath}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(schema) }} />;
}
