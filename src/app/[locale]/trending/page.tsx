// src/app/[locale]/trending/page.tsx
import type { Metadata } from "next";
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Container, Section } from "@/components/layout/layout";

export const metadata: Metadata = {
  title: "Trending News | DailySamachar",
  description: "Read the most trending and popular news stories today.",
};

export default async function TrendingNewsPage() {
  const articles = await cmsApi.getFeaturedArticles(24);

  return (
    <main className="bg-paper min-h-screen dark:bg-gray-950">
      <Section className="pt-8 pb-16 md:pt-12">
        <Container>
          <header className="border-line mb-10 border-b pb-6 dark:border-gray-800">
            <h1 className="editorial text-ink text-4xl font-bold sm:text-5xl dark:text-gray-100">
              Trending News
            </h1>
          </header>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}