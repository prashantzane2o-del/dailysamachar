import { wpAdapter, type PostCollection, type PostQuery, type PostSitemapEntry } from "@/shared/api/wordpress-adapter";
import type { Article, Author, Category, Tag } from "@/types/news";

/** Stable application-facing CMS contract. Routes depend on this interface, never on WordPress DTOs. */
export interface CmsClient {
  getPosts(params?: PostQuery): Promise<PostCollection>;
  getPostBySlug(slug: string): Promise<Article | null>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  searchPosts(query: string, page?: number, perPage?: number): Promise<PostCollection>;
  getPostSitemapEntries(): Promise<PostSitemapEntry[]>;
  getAuthorBySlug(slug: string): Promise<Author | null>;
  getPostsByAuthor(authorSlug: string, page?: number, perPage?: number): Promise<PostCollection>;
  getTagBySlug(slug: string): Promise<Tag | null>;
  getPostsByTag(tagSlug: string, page?: number, perPage?: number): Promise<PostCollection>;
}

const cmsClient: CmsClient = wpAdapter;

export const cmsApi = {
  async getArticleCollection(params?: PostQuery): Promise<PostCollection> {
    return cmsClient.getPosts(params);
  },

  async getArticles(params?: PostQuery): Promise<Article[]> {
    return (await cmsClient.getPosts(params)).data;
  },

  async getLatestArticles(limit = 10, page = 1): Promise<Article[]> {
    return (await cmsClient.getPosts({ page, perPage: limit })).data;
  },

  async getFeaturedArticles(limit = 6): Promise<Article[]> {
    return (await cmsClient.getPosts({ perPage: limit })).data;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    return cmsClient.getPostBySlug(slug);
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return cmsClient.getCategoryBySlug(slug);
  },

  async getTagBySlug(slug: string): Promise<Tag | null> {
    return cmsClient.getTagBySlug(slug);
  },

  async getCategories(): Promise<Category[]> {
    return cmsClient.getCategories();
  },

  async getArticlesByCategory(slug: string, page = 1, perPage = 12): Promise<Article[]> {
    return (await cmsClient.getPosts({ categorySlug: slug, page, perPage })).data;
  },

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    return cmsClient.getAuthorBySlug(slug);
  },

  async getArticlesByAuthor(slug: string, page = 1, perPage = 12): Promise<Article[]> {
    return (await cmsClient.getPosts({ authorSlug: slug, page, perPage })).data;
  },

  async getArticlesByTag(slug: string, page = 1, perPage = 12): Promise<Article[]> {
    return (await cmsClient.getPosts({ tagSlug: slug, page, perPage })).data;
  },

  async searchArticles(query: string, page = 1, perPage = 12): Promise<Article[]> {
    return (await cmsClient.searchPosts(query, page, perPage)).data;
  },

  async getPostSitemapEntries(): Promise<PostSitemapEntry[]> {
    return cmsClient.getPostSitemapEntries();
  },
};

export type { Article, Author, Category, PostCollection, PostQuery, PostSitemapEntry, Tag };
