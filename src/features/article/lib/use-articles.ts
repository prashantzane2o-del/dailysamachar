// src/features/article/lib/use-articles.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { cmsApi } from "@/shared/api/cms";
import type { Article } from "@/types/news"; // FIXED: Changed CmsArticle to Article

export function useInfiniteArticles(initialData?: Article[]) {
  return useInfiniteQuery({
    queryKey: ["articles", "infinite"],
    queryFn: ({ pageParam = 1 }) => cmsApi.getLatestArticles(10, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  });
}