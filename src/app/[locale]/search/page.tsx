import type { Metadata } from "next";
import { cmsClient } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchPageProps = { params: Promise<{ locale: string }>; searchParams: SearchParams };

function getQuery(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  await params;
  const resolvedSearchParams = await searchParams;
  const query = getQuery(resolvedSearchParams.q);
  return { title: query ? "Search results for “" + query + "”" : "Search news" };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const query = getQuery(resolvedSearchParams.q);
  const { data: posts } = query ? await cmsClient.searchPosts(query) : { data: [] };

  return (
    <main className="container-page py-10 sm:py-14">
      <div className="border-b border-line pb-6 dark:border-gray-800">
        <p className="kicker">Search</p>
        <h1 className="editorial mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-gray-100">
          {query ? "Results for “" + query + "”" : "Find your next story"}
        </h1>
        <form action={locale === "en" ? "/search" : "/" + locale + "/search"} className="mt-6 flex max-w-2xl gap-2">
          <label htmlFor="site-search" className="sr-only">Search news</label>
          <input id="site-search" name="q" defaultValue={query} placeholder="Search news..." className="min-w-0 grow rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-muted focus-visible:border-signal dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
          <button type="submit" className="rounded-lg bg-ink px-5 py-3 text-sm font-bold text-paper hover:bg-signal focus-visible:ring-2 focus-visible:ring-focus dark:bg-gray-100 dark:text-gray-900">Search</button>
        </form>
      </div>
      {!query ? (
        <p className="py-16 text-center text-lg text-muted">Enter a search term to find articles.</p>
      ) : posts.length === 0 ? (
        <p className="py-16 text-center text-lg text-muted">No articles found matching your search.</p>
      ) : (
        <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <ArticleCard key={post.id} article={post} />)}
        </div>
      )}
    </main>
  );
}
