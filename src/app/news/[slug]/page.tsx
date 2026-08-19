import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ArticlePage } from "@/features/article/ui/article-page";
import { getArticleBySlug, getRelatedArticles } from "@/services/news";

// 1. SEO Metadata Generation (Architecture SEO Standards)
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | DailySamachar" };
  }

  return {
    title: `${article.title} | DailySamachar`,
    description: article.excerpt || "Read the latest news and verified reporting on DailySamachar.",
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title: `${article.title} | DailySamachar`,
      description: article.excerpt || "Read the full article on DailySamachar.",
      type: "article",
      publishedTime: article.publishedAt,
      // FIX 1: article.author string type hai, isliye seedha string pass karenge 
      authors: article.author ? [article.author] : undefined,
    },
  };
}

// 2. Server Component for the Route
export default async function NewsArticleRoute({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const slug = (await params).slug;
  const locale = await getLocale();
  
  // Data sequentially fetch kar rahe hain taaki error na aaye
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // FIX 2: getRelatedArticles expects 2 arguments. Locale/Category ko 1st arg ke taur par pass kiya.
  // Agar aapke services/news/index.ts mein 1st arg categorySlug hai, toh (article.category, slug) use karein.
  const relatedArticles = await getRelatedArticles(locale, slug);

  return (
    // FIX 3: Prop ka naam 'relatedArticles' se badal kar 'related' kiya gaya
    <ArticlePage 
      article={article} 
      related={relatedArticles} 
    />
  );
}