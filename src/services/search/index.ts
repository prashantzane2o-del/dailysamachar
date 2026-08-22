import { cmsClient } from "@/shared/api/cms";
import type { Article } from "@/types/news";

export async function searchArticles(query: string): Promise<Article[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];
  const result = await cmsClient.searchPosts(normalizedQuery);
  return result.data;
}
