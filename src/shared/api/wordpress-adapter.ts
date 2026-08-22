import { z } from "zod";
import type { Article, Author, Category, Tag } from "@/types/news";
import {
  wpArticleArraySchema,
  wpAuthorSchema,
  wpCategorySchema,
  wpPostSitemapArraySchema,
  type WpArticle,
  type WpCategory,
} from "@/shared/api/wordpress-schemas";

export type PostQuery = {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  authorSlug?: string;
  tagSlug?: string;
};

export type PostCollection = {
  data: Article[];
  totalPages: number;
};

export type PostSitemapEntry = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
};

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;

function toIsoDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function toDomainCategory(category: WpCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    title: category.name,
    slug: category.slug,
    description: category.description,
    image: "",
  };
}

function toDomainTag(tag: WpCategory): Tag {
  return { id: String(tag.id), name: tag.name, slug: tag.slug };
}

export class WordPressAdapter {
  private readonly baseUrl: string;

  constructor() {
    const backendUrl = process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? "https://dailysamachar.org";
    this.baseUrl = `${backendUrl.replace(/\/$/, "")}/wp-json/wp/v2`;
  }

  private async fetchJson<T>(url: URL, schema: z.ZodType<T>, tags: string[]): Promise<{ data: T; response: Response }> {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["wordpress", ...tags] },
    });

    if (!response.ok) {
      throw new Error(`WordPress request failed with ${response.status}: ${response.statusText}`);
    }

    const rawData: unknown = await response.json();
    return { data: schema.parse(rawData), response };
  }

  private mapArticle(article: WpArticle): Article {
    const author = article._embedded?.author?.[0];
    const featuredMedia = article._embedded?.["wp:featuredmedia"]?.[0];
    const terms = article._embedded?.["wp:term"] ?? [];
    const category = terms[0]?.[0];
    const tags = terms[1] ?? [];
    const publishedAt = toIsoDate(article.date);

    return {
      id: String(article.id),
      slug: article.slug,
      title: article.title.rendered || "Untitled story",
      content: article.content.rendered || "",
      excerpt: article.excerpt.rendered || "",
      publishedAt,
      publishedAtIso: publishedAt,
      author: author?.name || "DailySamachar Desk",
      authorSlug: author?.slug,
      image: featuredMedia?.source_url || "",
      imageUrl: featuredMedia?.source_url,
      imageAlt: featuredMedia?.alt_text || article.title.rendered || "",
      category: category?.name || "News",
      tags: tags.map((tag) => tag.name),
    };
  }

  async getPosts(params: PostQuery = {}): Promise<PostCollection> {
    const page = Math.max(1, params.page ?? 1);
    const perPage = Math.min(MAX_PAGE_SIZE, Math.max(1, params.perPage ?? DEFAULT_PAGE_SIZE));
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));

    if (params.categorySlug) {
      const category = await this.getCategoryBySlug(params.categorySlug);
      if (!category) return { data: [], totalPages: 0 };
      url.searchParams.set("categories", category.id);
    }
    if (params.authorSlug) {
      const authorId = await this.getAuthorId(params.authorSlug);
      if (authorId === null) return { data: [], totalPages: 0 };
      url.searchParams.set("author", String(authorId));
    }
    if (params.tagSlug) {
      const tag = await this.getTagBySlug(params.tagSlug);
      if (!tag) return { data: [], totalPages: 0 };
      url.searchParams.set("tags", tag.id);
    }

    const result = await this.fetchJson(url, wpArticleArraySchema, ["articles"]);
    const totalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);

    return {
      data: result.data.map((article) => this.mapArticle(article)),
      totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    };
  }

  async getPostBySlug(slug: string): Promise<Article | null> {
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("slug", slug);
    const result = await this.fetchJson(url, wpArticleArraySchema, [`article-${slug}`]);
    const article = result.data[0];
    return article ? this.mapArticle(article) : null;
  }

  async getCategories(): Promise<Category[]> {
    const url = new URL(`${this.baseUrl}/categories`);
    url.searchParams.set("per_page", String(MAX_PAGE_SIZE));
    const result = await this.fetchJson(url, z.array(wpCategorySchema), ["categories"]);
    return result.data.map(toDomainCategory).sort((left, right) => left.title.localeCompare(right.title));
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const url = new URL(`${this.baseUrl}/categories`);
    url.searchParams.set("slug", slug);
    const result = await this.fetchJson(url, z.array(wpCategorySchema), [`category-${slug}`]);
    const category = result.data[0];
    return category ? toDomainCategory(category) : null;
  }

  private async getAuthorId(slug: string): Promise<number | null> {
    const url = new URL(`${this.baseUrl}/users`);
    url.searchParams.set("slug", slug);
    const result = await this.fetchJson(url, z.array(wpAuthorSchema), [`author-${slug}`]);
    return result.data[0]?.id ?? null;
  }

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const url = new URL(`${this.baseUrl}/users`);
    url.searchParams.set("slug", slug);
    const result = await this.fetchJson(url, z.array(wpAuthorSchema), [`author-${slug}`]);
    const author = result.data[0];
    if (!author) return null;
    return {
      slug: author.slug || slug,
      name: author.name,
      bio: author.description,
      expertise: [],
      avatar: author.avatar_urls?.["96"] || "",
    };
  }

  async getTagBySlug(slug: string): Promise<Tag | null> {
    const url = new URL(`${this.baseUrl}/tags`);
    url.searchParams.set("slug", slug);
    const result = await this.fetchJson(url, z.array(wpCategorySchema), [`tag-${slug}`]);
    const tag = result.data[0];
    return tag ? toDomainTag(tag) : null;
  }

  async getPostsByAuthor(authorSlug: string, page = 1, perPage = DEFAULT_PAGE_SIZE): Promise<PostCollection> {
    return this.getPosts({ authorSlug, page, perPage });
  }

  async getPostsByTag(tagSlug: string, page = 1, perPage = DEFAULT_PAGE_SIZE): Promise<PostCollection> {
    return this.getPosts({ tagSlug, page, perPage });
  }

  async searchPosts(query: string, page = 1, perPage = DEFAULT_PAGE_SIZE): Promise<PostCollection> {
    const normalizedQuery = query.trim().slice(0, 120);
    if (!normalizedQuery) return { data: [], totalPages: 0 };

    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("search", normalizedQuery);
    url.searchParams.set("page", String(Math.max(1, page)));
    url.searchParams.set("per_page", String(Math.min(MAX_PAGE_SIZE, Math.max(1, perPage))));
    const result = await this.fetchJson(url, wpArticleArraySchema, ["search"]);
    const totalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);

    return {
      data: result.data.map((article) => this.mapArticle(article)),
      totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    };
  }

  async getPostSitemapEntries(): Promise<PostSitemapEntry[]> {
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("per_page", String(MAX_PAGE_SIZE));
    url.searchParams.set("_fields", "id,slug,date,modified");
    const result = await this.fetchJson(url, wpPostSitemapArraySchema, ["sitemap"]);

    return result.data.map((entry) => ({
      slug: entry.slug,
      publishedAt: toIsoDate(entry.date),
      updatedAt: toIsoDate(entry.modified),
    }));
  }
}

export const wpAdapter = new WordPressAdapter();
