import { cmsClient } from "@/shared/api/cms";
import type { Article } from "@/types/news";

/**
 * Service facade retained for secondary editorial routes.
 * All reads are delegated to the validated CMS contract.
 */
export async function getLatestNews(_locale: string, limit = 10): Promise<Article[]> {
  const result = await cmsClient.getPosts({ perPage: limit });
  return result.data;
}

export async function getFeaturedArticles(_locale: string, limit = 1): Promise<Article[]> {
  const result = await cmsClient.getPosts({ perPage: Math.max(1, limit) });
  return result.data;
}

export async function getRelatedArticles(_locale: string, context: string): Promise<Article[]> {
  const result = await cmsClient.searchPosts(context, 1, 6);
  return result.data;
}
