import { wpAdapter, type PostCollection, type PostQuery, type PostSitemapEntry } from "@/shared/api/wordpress-adapter";
import type { Article, Author, Category, Tag } from "@/types/news";
import { createArticleRepository } from "@/entities/article/api/repository";
import type { CmsAdapter, CmsArticleDto } from "@/shared/types/cms";

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

export const cmsClient: CmsClient = wpAdapter;

function toEntityDto(article: Article): CmsArticleDto {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: typeof article.content === "string" ? article.content : undefined,
    featuredImage: article.image ? { url: article.image, alt: article.imageAlt, caption: article.caption } : undefined,
    categories: [{ name: article.category, slug: article.category.toLowerCase().replaceAll(" ", "-") }],
    tags: (article.tags ?? []).map((tag) => ({ name: tag, slug: tag.toLowerCase().replaceAll(" ", "-") })),
    author: { name: article.author, slug: article.authorSlug ?? article.author.toLowerCase().replaceAll(" ", "-") },
    date: article.publishedAt,
    modified: article.updatedAt,
  };
}

/** Compatibility repository for client-side entity hooks; its only source is the CMS contract above. */
const entityCmsAdapter: CmsAdapter = {
  async getArticle(slug) {
    const article = await cmsClient.getPostBySlug(slug);
    return article ? toEntityDto(article) : null;
  },
  async listArticles(query = {}) {
    const result = query.query ? await cmsClient.searchPosts(query.query) : await cmsClient.getPosts({ categorySlug: query.category });
    return { nodes: result.data.map(toEntityDto) };
  },
};

export const articleRepository = createArticleRepository(entityCmsAdapter);

export type { Article, Author, Category, PostCollection, PostQuery, PostSitemapEntry, Tag };
