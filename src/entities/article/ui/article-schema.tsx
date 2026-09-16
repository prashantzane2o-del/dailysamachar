import { getLocalizedPath } from "@/i18n/path";
import { JsonLd } from "@/shared/ui/json-ld";
import { stripCmsExcerpt, stripCmsHtml } from "@/shared/lib/cms-html";
import type { Article } from "@/types/news";

export interface ArticleSchemaProps {
  article: Article;
  url: string;
  locale?: string;
}

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
}

function articleDescription(article: Article): string {
  return (stripCmsExcerpt(article.excerpt) || stripCmsHtml(article.title) || "DailySamachar story").slice(0, 160);
}

/**
 * Maps the application article model to Google's NewsArticle structured data.
 * The shared wrapper safely serializes the result for an inline JSON-LD script.
 */
export function ArticleSchema({ article, url, locale }: ArticleSchemaProps) {
  const origin = siteOrigin();
  const headline = stripCmsHtml(article.title) || article.title;
  const authorName = stripCmsHtml(article.author) || "DailySamachar Desk";
  const authorUrl = article.authorSlug
    ? `${origin}${getLocalizedPath(locale || "en", `/author/${article.authorSlug}`)}`
    : origin;
  const publishedAt = article.publishedAtIso || article.publishedAt;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline,
    image: article.image ? [article.image] : [],
    datePublished: publishedAt,
    dateModified: article.updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "DailySamachar",
      url: origin,
      logo: {
        "@type": "ImageObject",
        url: `${origin}/Logo.png`,
      },
    },
    description: articleDescription(article),
    inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
  } satisfies Record<string, unknown>;

  return <JsonLd data={schemaData} />;
}
