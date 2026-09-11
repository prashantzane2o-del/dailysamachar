"use client";

import { useEffect } from "react";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { useInfiniteArticles } from "@/entities/article/lib/use-articles";
import { useIntersectionObserver } from "@/shared/hooks/use-intersection-observer";
import { Article } from "@/types/news";

interface InfiniteArticleFeedProps {
  initialArticles: Article[];
}

export function InfiniteArticleFeed({ initialArticles }: InfiniteArticleFeedProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteArticles(initialArticles);

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "0px 0px 800px",
    disabled: !hasNextPage || isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting]);

  if (status === "error") {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Failed to load more articles: {error instanceof Error ? error.message : "Unknown error"}</p>
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
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
            {page.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-6">
          <div
            className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600 motion-safe:animate-spin"
            role="status"
            aria-label="Loading more articles..."
          />
        </div>
      )}

      <div ref={loadMoreRef} aria-hidden="true" className="h-px" />

      {!hasNextPage && data.pages.length > 1 && (
        <div className="py-8 text-center text-gray-500">
          <p>You have reached the end of the feed.</p>
        </div>
      )}
    </div>
  );
}
