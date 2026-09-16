import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticlePage as ArticlePageView } from "@/features/article/ui/article-page";
import { getLocalizedPath } from "@/i18n/path";
import { ArticleSchema } from "@/entities/article/ui/article-schema";
import { cmsApi } from "@/shared/api/cms";
import { stripCmsExcerpt, stripCmsHtml } from "@/shared/lib/cms-html";

interface ArticleRouteProps {
  params: Promise<{ locale: string; slug: string }>;
}

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
}

function descriptionFor(article: { excerpt?: string; title: string }): string {
  const description = stripCmsExcerpt(article.excerpt);
  return (description || stripCmsHtml(article.title) || "DailySamachar story").slice(0, 160);
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await cmsApi.getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | DailySamachar", robots: { index: false, follow: true } };
  }

  const title = stripCmsHtml(article.title) || "DailySamachar story";
  const description = descriptionFor(article);
  const canonicalPath = getLocalizedPath(locale, `/news/${article.slug}`);
  const canonicalUrl = `${siteOrigin()}${canonicalPath}`;
  const publishedAt = article.publishedAtIso || article.publishedAt;

  return {
    title: `${title} | DailySamachar`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: article.updatedAt,
      authors: [stripCmsHtml(article.author) || "DailySamachar"],
      images: article.image ? [{ url: article.image, alt: article.imageAlt || title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticleRoute({ params }: ArticleRouteProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await cmsApi.getArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${siteOrigin()}${getLocalizedPath(locale, `/news/${article.slug}`)}`;
  const related = await cmsApi
    .searchArticles(article.category, 1, 6)
    .then((items) => items.filter((candidate) => candidate.id !== article.id).slice(0, 4))
    .catch((error: unknown) => {
      console.error("Failed to load related articles", error);
      return [];
    });

  return (
    <>
      <ArticleSchema article={article} locale={locale} url={articleUrl} />
      <ArticlePageView article={article} related={related} locale={locale} />
    </>
  );
}
