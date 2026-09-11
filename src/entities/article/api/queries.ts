"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { articleRepository } from "./client";
import { articleKeys } from "./query-keys";
import type { ArticleQuery } from "../model/types";
export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articleRepository.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
export function useInfiniteArticles(query: ArticleQuery = {}) {
  return useInfiniteQuery({
    queryKey: articleKeys.list(query),
    queryFn: ({ pageParam }) => articleRepository.list({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor,
  });
}
