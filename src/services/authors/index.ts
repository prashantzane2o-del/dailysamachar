import { cmsClient } from "@/shared/api/cms";
import type { Article, Author } from "@/types/news";

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  return cmsClient.getAuthorBySlug(slug);
}

export async function getArticlesByAuthor(slug: string): Promise<Article[]> {
  const result = await cmsClient.getPostsByAuthor(slug);
  return result.data;
}
