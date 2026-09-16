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
      "@id": `${baseUrl}/#organization`,
      name: "DailySamachar",
      url: `${baseUrl}${sitePath}`,
      logo: `${baseUrl}/Logo.png`,
      description: "Verified, independent news from India and around the world.",
      email: "news@dailysamachar.org",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "newsroom",
        email: "news@dailysamachar.org",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
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
