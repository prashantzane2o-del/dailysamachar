import { stripCmsHtml } from "@/shared/ui/sanitized-html";
import type { Article } from "@/types/news";

interface ArticleSchemaProps {
  article: Article;
  locale: string;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");
}

export function ArticleSchema({ article, locale }: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org";
  const articleUrl = `${baseUrl}/${locale}/news/${encodeURIComponent(article.slug)}`;
  const publishedAt = new Date(article.publishedAt);
  const modifiedAt = new Date(article.updatedAt ?? article.publishedAt);
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: stripCmsHtml(article.title),
    description: stripCmsHtml(article.excerpt),
    image: article.image ? [article.image] : [],
    datePublished: Number.isNaN(publishedAt.getTime()) ? article.publishedAt : publishedAt.toISOString(),
    dateModified: Number.isNaN(modifiedAt.getTime()) ? article.updatedAt ?? article.publishedAt : modifiedAt.toISOString(),
    author: { "@type": "Person", name: article.author || "DailySamachar Desk" },
    publisher: { "@type": "Organization", name: "DailySamachar", url: baseUrl },
    inLanguage: locale,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(schema) }} />;
}
