import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cmsClient } from "@/shared/api/cms";
import { ArticleSchema } from "@/components/seo/article-schema";
import { ArticlePage } from "@/features/article/ui/article-page";
import { stripCmsHtml } from "@/shared/ui/sanitized-html";

type ArticleRouteProps = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await cmsClient.getPostBySlug(slug);
  if (!article) return { title: "Story not found" };
  const title = stripCmsHtml(article.title) || "DailySamachar story";
  const description = stripCmsHtml(article.excerpt);
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: article.image ? [article.image] : undefined },
  };
}

export default async function NewsArticlePage({ params }: ArticleRouteProps) {
  const { slug, locale } = await params;
  const article = await cmsClient.getPostBySlug(slug);
  if (!article) notFound();

  const relatedResponse = await cmsClient.getPosts({ perPage: 8 });
  const related = relatedResponse.data.filter((candidate) => candidate.slug !== article.slug).slice(0, 3);

  return (
    <>
      <ArticleSchema article={article} locale={locale} />
      <ArticlePage article={article} related={related} />
    </>
  );
}
