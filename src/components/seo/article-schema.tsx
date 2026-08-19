import { Article } from "@/types/news";

interface ArticleSchemaProps {
  article: Article;
  locale: string;
}

export function ArticleSchema({ article, locale }: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.com";
  const articleUrl = `${baseUrl}/${locale}/news/${article.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [article.image] : [],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    author: article.author ? {
      "@type": "Person",
      name: article.author,
    } : {
      "@type": "Organization",
      name: "Editorial Desk",
    },
    publisher: {
      "@type": "Organization",
      name: "Daily Samachar",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}