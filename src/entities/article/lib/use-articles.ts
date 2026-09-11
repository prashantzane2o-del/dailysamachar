"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { cmsApi } from "@/shared/api/cms";
import type { CmsArticle } from "@/shared/types/cms";

export function useInfiniteArticles(initialData?: CmsArticle[]) {
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
