"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Article } from "@/types/news";

interface InfiniteArticleFeedProps {
  initialArticles: Article[];
  categoryId?: string;
  locale: string;
}

interface FetchArticlesResponse {
  data: Article[];
  nextCursor: number | null;
}

export function InfiniteArticleFeed({ initialArticles, categoryId, locale }: InfiniteArticleFeedProps) {
  const fetchArticles = async ({ pageParam }: { pageParam: number }): Promise<FetchArticlesResponse> => {
    const url = new URL("/api/articles", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    url.searchParams.set("page", pageParam.toString());
    url.searchParams.set("locale", locale);
    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.statusText}`);
    }

    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["articles", categoryId, locale],
    queryFn: fetchArticles,
    initialPageParam: 2,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [{ data: initialArticles, nextCursor: 2 }],
      pageParams: [1],
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 800;

      if (scrollPosition >= threshold && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "error") {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Failed to load more articles: {error instanceof Error ? error.message : "Unknown error"}</p>
        <button 
          onClick={() => fetchNextPage()} 
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.pages.map((page, pageIndex) => (
          <div key={`page-${pageIndex}`} className="contents">
            {page.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ))}
      </div>
      
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" aria-label="Loading more articles..." />
        </div>
      )}
      
      {!hasNextPage && data.pages.length > 1 && (
        <div className="py-8 text-center text-gray-500">
          <p>You have reached the end of the feed.</p>
        </div>
      )}
    </div>
  );
}