import { cmsClient } from "@/shared/api/cms";
import type { Article } from "@/types/news";

export * from "./content";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return cmsClient.getPostBySlug(slug);
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const result = await cmsClient.getPosts({ categorySlug: slug });
  return result.data;
}

export async function getFeaturedArticles(_locale: string, limit = 6): Promise<Article[]> {
  const result = await cmsClient.getPosts({ perPage: limit });
  return result.data;
}

export async function getRelatedArticles(_locale: string, context: string): Promise<Article[]> {
  const result = await cmsClient.searchPosts(context, 1, 6);
  return result.data;
}
