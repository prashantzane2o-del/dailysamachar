// src/shared/api/wordpress-adapter.ts
import { z } from "zod";
import { draftMode } from "next/headers";
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
  categoryId?: number;
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

// --- System Constants ---
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 10_000;
const REVALIDATE_SECONDS = 3600; // 1 Hour default cache
const MAX_RETRIES = 2; // Auto-retry count for transient errors

export const DEFAULT_ARTICLE_IMAGE = "/Logo.svg"; 

// --- Utility Functions ---
function stripCmsHtml(html: string | undefined | null): string {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, "")
    .trim();
}

function toIsoDate(value: string | undefined | null): string {
  if (!value) return new Date(0).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function toSafeImageUrl(value: string | undefined | null): string {
  if (!value) return DEFAULT_ARTICLE_IMAGE;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : DEFAULT_ARTICLE_IMAGE;
  } catch {
    return DEFAULT_ARTICLE_IMAGE;
  }
}

function toDomainCategory(category: WpCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    title: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    image: "",
  };
}

function toDomainTag(tag: WpCategory): Tag {
  return { id: String(tag.id), name: tag.name, slug: tag.slug };
}

// --- AAA-Level Adapter Class ---
export class WordPressAdapter {
  private readonly baseUrl: string;
  private readonly backendDomain: string;

  constructor() {
    // Priority: env variables -> fallback to api.dailysamachar.org
    const backendUrl =
      process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? "https://api.dailysamachar.org";
    this.backendDomain = backendUrl.replace(/\/(?:wp-json\/wp\/v2)\/?$/, "").replace(/\/$/, "");
    this.baseUrl = `${this.backendDomain}/wp-json/wp/v2`;
  }

  // Parses inner HTML content to fix relative image paths from WordPress
  private cleanHtml(html: string | undefined | null): string {
    if (!html) return "";
    let processed = html.replace(
      /(src|href|srcset|data-src|data-srcset|data-lazy-src)=["'](\/[^"']+)["']/gi,
      `$1="${this.backendDomain}$2"`,
    );
    const httpUrl = this.backendDomain.replace("https://", "http://");
    processed = processed.replaceAll(httpUrl, this.backendDomain);
    return processed;
  }

  // Core API Fetcher with Retries & Draft Mode support
  private async fetchJson<T>(
    url: URL,
    schema: z.ZodType<T>,
    tags: string[],
    retries = MAX_RETRIES,
  ): Promise<{ data: T; response: Response }> {
    let isDraftMode = false;
    try {
      const draft = await draftMode();
      isDraftMode = draft.isEnabled;
    } catch {
      isDraftMode = false;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const fetchOptions: RequestInit = isDraftMode
          ? { cache: "no-store" } // Bypass cache if previewing draft
          : {
              next: {
                revalidate: REVALIDATE_SECONDS,
                tags: ["wordpress", "wordpress-posts", ...tags], // Enables on-demand ISR
              },
            };

        const headers: HeadersInit = {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DailySamachar/1.0",
        };

        // Attach Authorization token if in Draft mode (to fetch unpublished posts)
        if (isDraftMode && process.env.WORDPRESS_AUTH_TOKEN) {
          headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`;
        }

        const response = await fetch(url.toString(), {
          headers,
          signal: controller.signal,
          ...fetchOptions,
        });

        const textData = await response.text();
        let rawData: unknown;
        try {
          rawData = textData ? JSON.parse(textData) : {};
        } catch {
          throw new Error(`WP returned invalid JSON. Snippet: ${textData.slice(0, 150)}`);
        }

        if (!response.ok) {
          const errorPayload = typeof rawData === "object" && rawData !== null ? rawData : {};
          const errorMessage =
            ("message" in errorPayload && errorPayload.message) ||
            ("code" in errorPayload && errorPayload.code) ||
            response.statusText;
          throw new Error(`HTTP ${response.status} at ${url.pathname} - Reason: ${errorMessage}`);
        }

        // Prevent Zod Crash if WP sends single object instead of array
        if (url.pathname.includes("/posts") && !url.searchParams.has("slug") && !Array.isArray(rawData)) {
          console.warn("  [WP Adapter] Expected array but got object. WP Response:", rawData);
          rawData = []; 
        }

        const parsed = schema.safeParse(rawData);
        if (!parsed.success) {
          console.error(`  [WP Adapter] Schema validation failed for ${url.pathname}:`, parsed.error.issues);
          throw new Error("WordPress returned an invalid schema format");
        }

        return { data: parsed.data, response };
      } catch (error) {
        if (attempt === retries) {
          console.error(
            `  [WP Adapter] Final failure for ${url.pathname}:`,
            error instanceof Error ? error.message : error,
          );
          throw error instanceof Error ? error : new Error("WordPress request failed");
        }
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error("Unreachable code");
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
      title: article.title?.rendered || "Untitled story",
      content: this.cleanHtml(article.content?.rendered),
      excerpt: this.cleanHtml(article.excerpt?.rendered),
      publishedAt,
      publishedAtIso: publishedAt,
      author: author?.name || "DailySamachar Desk",
      authorSlug: author?.slug ?? undefined,
      image: toSafeImageUrl(featuredMedia?.source_url),
      imageUrl: toSafeImageUrl(featuredMedia?.source_url),
      imageAlt: stripCmsHtml(featuredMedia?.alt_text || article.title?.rendered || "Daily Samachar news"),
      category: stripCmsHtml(category?.name || "News"),
      updatedAt: article.modified ? toIsoDate(article.modified) : publishedAt,
      tags: tags.map((tag) => stripCmsHtml(tag.name)),
    };
  }

  async getPosts(params: PostQuery = {}): Promise<PostCollection> {
    const page = Math.max(1, params.page ?? 1);
    const perPage = Math.min(MAX_PAGE_SIZE, Math.max(1, params.perPage ?? DEFAULT_PAGE_SIZE));
    
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));

    const [category, authorId, tag] = await Promise.all([
      params.categoryId || params.categorySlug
        ? params.categoryId
          ? Promise.resolve({ id: params.categoryId })
          : this.getCategoryBySlug(params.categorySlug ?? "")
        : Promise.resolve(null),
      params.authorSlug ? this.getAuthorId(params.authorSlug) : Promise.resolve(null),
      params.tagSlug ? this.getTagBySlug(params.tagSlug) : Promise.resolve(null),
    ]);

    if (params.categorySlug && !category) return { data: [], totalPages: 0 };
    if (params.authorSlug && !authorId) return { data: [], totalPages: 0 };
    if (params.tagSlug && !tag) return { data: [], totalPages: 0 };

    if (category) url.searchParams.set("categories", String(category.id));
    if (authorId) url.searchParams.set("author", String(authorId));
    if (tag) url.searchParams.set("tags", String(tag.id));

    const result = await this.fetchJson(url, wpArticleArraySchema, ["articles"]);
    const totalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);

    return {
      data: result.data.map((article) => this.mapArticle(article)),
      totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    };
  }

  async getPostBySlug(slug: string): Promise<Article | null> {
    const normalizedSlug = slug.trim().slice(0, 180);
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("slug", normalizedSlug);

    const result = await this.fetchJson(url, wpArticleArraySchema, [
      `article-${normalizedSlug.replace(/[^a-z0-9-]/gi, "")}`,
    ]);

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
      name: author.name || "Unknown Author",
      bio: author.description ?? undefined,
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
    return result.data.map((entry) => {
      return {
        slug: entry.slug,
        publishedAt: toIsoDate(entry.date),
        updatedAt: toIsoDate(entry.modified),
      };
    });
  }
}

export const wpAdapter = new WordPressAdapter();