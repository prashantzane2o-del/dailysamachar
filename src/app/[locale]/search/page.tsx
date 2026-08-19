import { Suspense } from "react";
import { searchArticles } from "@/services/search";
import { ArticleCard } from "@/entities/article/ui/article-card";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Search Results {query ? `for "${query}"` : ""}
      </h1>
      <Suspense fallback={<div className="animate-pulse">Loading results...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return <div className="text-gray-500">Please enter a search term to begin.</div>;
  }

  const results = await searchArticles(query);

  if (!results || results.length === 0) {
    return <div className="text-gray-500">No articles found matching your query.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}