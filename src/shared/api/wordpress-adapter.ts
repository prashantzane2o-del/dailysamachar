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
import { stripCmsHtml } from "@/shared/ui/sanitized-html";

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

type FetchJsonResult<T> = {
  data: T;
  response: Response;
};

// --- System Constants ---
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 3600;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 800;
const MAX_SITEMAP_PAGES = 500;
// Keep the circuit open during an outage so every server component does not
// retry the same broken WordPress connection on the next request.
const UNAVAILABLE_BACKEND_COOLDOWN_MS = 60_000;
const UNREACHABLE_NETWORK_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "UND_ERR_CONNECT_TIMEOUT",
]);
const RETRYABLE_HTTP_STATUSES = new Set([408, 425, 429]);
export const DEFAULT_WORDPRESS_API_URL = "https://api.dailysamachar.org";
export const DEFAULT_ARTICLE_IMAGE = "/Logo.svg";

// --- Utility Functions ---
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
  const cleanName = stripCmsHtml(category.name);
  return {
    id: String(category.id),
    name: cleanName,
    title: cleanName,
    slug: category.slug,
    description: category.description ? stripCmsHtml(category.description) : undefined,
    image: "",
  };
}

function toDomainTag(tag: WpCategory): Tag {
  return { id: String(tag.id), name: stripCmsHtml(tag.name), slug: tag.slug };
}

export function normalizeWordPressApiUrl(configuredUrl: string | undefined): string {
  const sourceUrl = configuredUrl?.trim() || DEFAULT_WORDPRESS_API_URL;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    throw new Error("WORDPRESS_API_URL must be a valid absolute HTTP(S) URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("WORDPRESS_API_URL must use HTTP or HTTPS.");
  }

  const sitePath = parsedUrl.pathname.replace(/\/wp-json\/wp\/v2\/?$/, "").replace(/\/$/, "");

  return `${parsedUrl.origin}${sitePath}`;
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  if ("code" in error && typeof error.code === "string") return error.code;

  if ("cause" in error) return getErrorCode(error.cause);

  return undefined;
}

function isUnreachableNetworkError(error: unknown): boolean {
  const errorCode = getErrorCode(error);
  return (
    (errorCode !== undefined && UNREACHABLE_NETWORK_CODES.has(errorCode)) ||
    (error instanceof Error && error.name === "AbortError")
  );
}

class WordPressBackendUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("WordPress backend is temporarily unavailable.", cause === undefined ? undefined : { cause });
    this.name = "WordPressBackendUnavailableError";
  }
}

class WordPressHttpError extends Error {
  readonly status: number;

  constructor(status: number, url: URL) {
    super(`WordPress returned HTTP ${status} at ${url.pathname}`);
    this.name = "WordPressHttpError";
    this.status = status;
  }
}

function isRetryableError(error: unknown): boolean {
  if (isUnreachableNetworkError(error)) return true;
  if (!(error instanceof WordPressHttpError)) return false;

  return error.status >= 500 || RETRYABLE_HTTP_STATUSES.has(error.status);
}

function getErrorLabel(error: unknown): string {
  if (error instanceof WordPressHttpError) return `HTTP ${error.status}`;
  return getErrorCode(error) ?? (isUnreachableNetworkError(error) ? "request timed out" : "fetch failed");
}

// --- AAA-Level Adapter Class ---
export class WordPressAdapter {
  private readonly baseUrl: string;
  private readonly backendDomain: string;
  private unavailableUntil = 0;
  private activeBackendAttempt: Promise<boolean> | null = null;
  private readonly inFlightRequests = new Map<string, Promise<FetchJsonResult<unknown>>>();

  constructor() {
    this.backendDomain = normalizeWordPressApiUrl(
      process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    );
    this.baseUrl = `${this.backendDomain}/wp-json/wp/v2`;
  }

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

  private async getDraftMode(): Promise<boolean> {
    try {
      return (await draftMode()).isEnabled;
    } catch {
      return false;
    }
  }

  private async fetchJson<T>(
    url: URL,
    schema: z.ZodType<T>,
    tags: string[],
    retries = MAX_RETRIES,
  ): Promise<FetchJsonResult<T>> {
    const isDraftMode = await this.getDraftMode();
    const requestKey = `${isDraftMode ? "draft" : "published"}:${url.toString()}`;
    const existingRequest = this.inFlightRequests.get(requestKey);

    if (existingRequest) {
      return existingRequest as Promise<FetchJsonResult<T>>;
    }

    const request = this.fetchJsonWithBackendGate(url, schema, tags, retries, isDraftMode);
    this.inFlightRequests.set(requestKey, request);

    try {
      return await request;
    } finally {
      if (this.inFlightRequests.get(requestKey) === request) {
        this.inFlightRequests.delete(requestKey);
      }
    }
  }

  private async fetchJsonWithBackendGate<T>(
    url: URL,
    schema: z.ZodType<T>,
    tags: string[],
    retries: number,
    isDraftMode: boolean,
  ): Promise<FetchJsonResult<T>> {
    if (isDraftMode) {
      return this.fetchJsonFromWordPress(url, schema, tags, retries, true);
    }

    if (this.unavailableUntil > Date.now()) {
      throw new WordPressBackendUnavailableError();
    }

    const activeAttempt = this.activeBackendAttempt;
    if (activeAttempt) {
      const isBackendReachable = await activeAttempt;
      if (!isBackendReachable || this.unavailableUntil > Date.now()) {
        throw new WordPressBackendUnavailableError();
      }
    }

    const request = this.fetchJsonFromWordPress(url, schema, tags, retries, false);
    const backendAvailability = request.then(
      () => true,
      (error: unknown) => !(error instanceof WordPressBackendUnavailableError),
    );
    this.activeBackendAttempt = backendAvailability;

    try {
      return await request;
    } finally {
      if (this.activeBackendAttempt === backendAvailability) {
        this.activeBackendAttempt = null;
      }
    }
  }

  private async fetchJsonFromWordPress<T>(
    url: URL,
    schema: z.ZodType<T>,
    tags: string[],
    retries: number,
    isDraftMode: boolean,
  ): Promise<FetchJsonResult<T>> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const fetchOptions: RequestInit = isDraftMode
          ? { cache: "no-store" }
          : {
              next: {
                revalidate: REVALIDATE_SECONDS,
                tags: ["wordpress", "wordpress-posts", ...tags],
              },
            };

        const headers: HeadersInit = {
          Accept: "application/json",
          "User-Agent": "DailySamachar-NextJS-Adapter/1.0",
        };

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
          throw new WordPressHttpError(response.status, url);
        }

        if (url.pathname.includes("/posts") && !url.searchParams.has("slug") && !Array.isArray(rawData)) {
          rawData = [];
        }

        const parsed = schema.safeParse(rawData);
        if (!parsed.success) {
          throw new Error("WordPress returned an invalid schema format");
        }

        this.unavailableUntil = 0;
        return { data: parsed.data, response };
      } catch (error) {
        const cannotReachConfiguredHost = isUnreachableNetworkError(error);

        if (attempt === retries) {
          if (cannotReachConfiguredHost) {
            const wasAlreadyUnavailable = this.unavailableUntil > Date.now();
            this.unavailableUntil = Date.now() + UNAVAILABLE_BACKEND_COOLDOWN_MS;

            if (!wasAlreadyUnavailable) {
              console.warn(`[WP Adapter Warning] Unreachable endpoint: ${url.pathname} (${getErrorLabel(error)})`);
            }
            throw new WordPressBackendUnavailableError(error);
          }

          console.warn(`[WP Adapter Warning] Request failed: ${url.pathname} (${getErrorLabel(error)})`);
          throw new Error("WordPress request failed.", { cause: error });
        }

        if (!isRetryableError(error)) {
          console.warn(`[WP Adapter Warning] Request failed: ${url.pathname} (${getErrorLabel(error)})`);
          throw new Error("WordPress request failed.", { cause: error });
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
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
      title: stripCmsHtml(article.title?.rendered || "Untitled story"),
      content: this.cleanHtml(article.content?.rendered),
      excerpt: this.cleanHtml(article.excerpt?.rendered),
      publishedAt,
      publishedAtIso: publishedAt,
      author: stripCmsHtml(author?.name || "DailySamachar Desk"),
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

    try {
      const result = await this.fetchJson(url, wpArticleArraySchema, ["articles"]);
      const totalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);

      return {
        data: result.data.map((article) => this.mapArticle(article)),
        totalPages: Number.isFinite(totalPages) ? totalPages : 1,
      };
    } catch {
      return { data: [], totalPages: 0 };
    }
  }

  async getPostBySlug(slug: string): Promise<Article | null> {
    const normalizedSlug = slug.trim().slice(0, 180);
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_embed", "true");
    url.searchParams.set("slug", normalizedSlug);

    try {
      const result = await this.fetchJson(url, wpArticleArraySchema, [
        `article-${normalizedSlug.replace(/[^a-z0-9-]/gi, "")}`,
      ]);
      const article = result.data[0];
      return article ? this.mapArticle(article) : null;
    } catch {
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    const url = new URL(`${this.baseUrl}/categories`);
    url.searchParams.set("per_page", String(MAX_PAGE_SIZE));
    url.searchParams.set("orderby", "count");
    url.searchParams.set("order", "desc");
    url.searchParams.set("hide_empty", "true");

    try {
      const result = await this.fetchJson(url, z.array(wpCategorySchema), ["categories"]);
      return result.data.map(toDomainCategory);
    } catch {
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const url = new URL(`${this.baseUrl}/categories`);
    url.searchParams.set("slug", slug);

    try {
      const result = await this.fetchJson(url, z.array(wpCategorySchema), [`category-${slug}`]);
      const category = result.data[0];
      return category ? toDomainCategory(category) : null;
    } catch {
      return null;
    }
  }

  private async getAuthorId(slug: string): Promise<number | null> {
    const url = new URL(`${this.baseUrl}/users`);
    url.searchParams.set("slug", slug);
    try {
      const result = await this.fetchJson(url, z.array(wpAuthorSchema), [`author-${slug}`]);
      return result.data[0]?.id ?? null;
    } catch {
      return null;
    }
  }

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const url = new URL(`${this.baseUrl}/users`);
    url.searchParams.set("slug", slug);
    try {
      const result = await this.fetchJson(url, z.array(wpAuthorSchema), [`author-${slug}`]);
      const author = result.data[0];

      if (!author) return null;

      return {
        slug: author.slug || slug,
        name: stripCmsHtml(author.name || "Unknown Author"),
        bio: author.description ? stripCmsHtml(author.description) : undefined,
        expertise: [],
        avatar: author.avatar_urls?.["96"] || "",
      };
    } catch {
      return null;
    }
  }

  async getTagBySlug(slug: string): Promise<Tag | null> {
    const url = new URL(`${this.baseUrl}/tags`);
    url.searchParams.set("slug", slug);
    try {
      const result = await this.fetchJson(url, z.array(wpCategorySchema), [`tag-${slug}`]);
      const tag = result.data[0];
      return tag ? toDomainTag(tag) : null;
    } catch {
      return null;
    }
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

    try {
      const result = await this.fetchJson(url, wpArticleArraySchema, ["search"]);
      const totalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);

      return {
        data: result.data.map((article) => this.mapArticle(article)),
        totalPages: Number.isFinite(totalPages) ? totalPages : 1,
      };
    } catch {
      return { data: [], totalPages: 0 };
    }
  }

  async getPostSitemapEntries(): Promise<PostSitemapEntry[]> {
    try {
      const entries: PostSitemapEntry[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages && page <= MAX_SITEMAP_PAGES) {
        const url = new URL(`${this.baseUrl}/posts`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("per_page", String(MAX_PAGE_SIZE));
        url.searchParams.set("_fields", "id,slug,date,modified");

        const result = await this.fetchJson(url, wpPostSitemapArraySchema, ["sitemap"]);
        entries.push(
          ...result.data.map((entry) => ({
            slug: entry.slug,
            publishedAt: toIsoDate(entry.date),
            updatedAt: toIsoDate(entry.modified),
          })),
        );

        const reportedTotalPages = Number.parseInt(result.response.headers.get("X-WP-TotalPages") ?? "1", 10);
        totalPages = Number.isFinite(reportedTotalPages) ? Math.max(1, reportedTotalPages) : 1;
        page += 1;
      }

      return entries;
    } catch {
      return [];
    }
  }
}

export const wpAdapter = new WordPressAdapter();
