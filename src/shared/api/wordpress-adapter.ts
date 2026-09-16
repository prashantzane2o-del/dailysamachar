// src/shared/api/wordpress-adapter.ts
import { z } from "zod";
import { draftMode } from "next/headers";
import type { Article, Author, Category, Tag } from "@/types/news";
import {
  wpArticleArraySchema,
  wpAuthorSchema,
  wpCategorySchema,
  wpPostSitemapArraySchema,
  type WpCategory,
  type WpArticle,
} from "@/shared/api/wordpress-schemas";
import { stripCmsExcerpt, stripCmsHtml } from "@/shared/lib/cms-html";

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
const REQUEST_TIMEOUT_MS = 15_000;
const REVALIDATE_SECONDS = 3600;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 800;
const MAX_SITEMAP_PAGES = 500;
const UNAVAILABLE_BACKEND_COOLDOWN_MS = 5_000;

export const DEFAULT_WORDPRESS_API_URL = "https://api.dailysamachar.org";
export const DEFAULT_ARTICLE_IMAGE = "/Logo.svg";

// --- AAA Utility Functions ---

function decodeHTMLEntities(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(text: string | null | undefined): string {
  return decodeHTMLEntities(stripCmsHtml(text)).trim();
}

function toIsoDate(value: string | undefined | null): string {
  if (!value) return new Date(0).toISOString();
  // FIX: Explicitly append 'Z' to treat timezone-less WP dates as UTC, preventing timezone offset bugs
  const dateStr = value.endsWith("Z") || value.includes("+") ? value : `${value}Z`;
  const date = new Date(dateStr);
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

function estimateReadTime(htmlContent: string | undefined | null): string {
  if (!htmlContent) return "1 Min Read";
  const textContent = htmlContent.replace(/<[^>]*>?/gm, "").trim();
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));
  return `${readTime} Min Read`;
}

function toDomainCategory(category: WpCategory): Category {
  const cleanName = cleanText(category.name);
  return {
    id: String(category.id),
    name: cleanName,
    title: cleanName,
    slug: category.slug || "news",
    description: category.description ? cleanText(category.description) : undefined,
    image: "",
  };
}

function toDomainTag(tag: { id?: unknown; name?: string; slug?: string }): Tag {
  return { id: String(tag.id), name: cleanText(tag.name), slug: tag.slug || "tag" };
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
    let processed = html;

    processed = processed.replace(/<a[^>]*class="[^"]*more-link[^"]*"[^>]*>.*?<\/a>/gi, "");
    processed = processed.replace(/<a[^>]*href="[^"]*"[^>]*>\s*\[&hellip;\]\s*<\/a>/gi, "");
    processed = processed.replace(/\[&hellip;\]/g, "...");

    const rawDomain = this.backendDomain.replace(/^https?:\/\//, "");
    const domainRegex = new RegExp(`href=["']https?://${rawDomain}/([^"']*)["']`, "gi");

    processed = processed.replace(domainRegex, (match, path) => {
      if (path.startsWith("wp-content/") || path.startsWith("wp-admin/") || path.startsWith("wp-includes/")) {
        return match;
      }
      if (path.startsWith("category/")) return `href="/${path}"`;
      if (path.startsWith("tag/")) return `href="/${path}"`;
      if (path.startsWith("author/")) return `href="/${path}"`;

      const segments = path.split("/").filter(Boolean);
      const slug = segments.length > 0 ? segments[segments.length - 1] : "";

      if (slug) {
        return `href="/news/${slug}"`;
      }
      return `href="/"`;
    });

    processed = processed.replace(
      /(src|srcset|data-src|data-srcset|data-lazy-src)=["'](\/[^"']+)["']/gi,
      `$1="${this.backendDomain}$2"`,
    );

    // FIX: Inject loading="lazy" decoding="async" into all images and iframes to prevent Core Web Vitals penalties
    processed = processed.replace(
      /<img(?!.*loading=["']lazy["'])([^>]*)>/gi,
      '<img loading="lazy" decoding="async"$1>',
    );
    processed = processed.replace(/<iframe(?!.*loading=["']lazy["'])([^>]*)>/gi, '<iframe loading="lazy"$1>');

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
        };

        if (isDraftMode && process.env.WORDPRESS_AUTH_TOKEN) {
          headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`;
        }

        const response = await fetch(url.toString(), {
          headers,
          signal: controller.signal,
          ...fetchOptions,
        });

        if (!response.ok) {
          console.error(`🚨 [WP API Error] HTTP ${response.status} from ${url.toString()}.`);
          throw new WordPressHttpError(response.status, url);
        }

        const textData = await response.text();
        let rawData: unknown;
        try {
          rawData = textData ? JSON.parse(textData) : {};
        } catch {
          console.error(`🚨 [WP API Error] Invalid JSON from ${url.toString()}. Snippet:`, textData.slice(0, 200));
          throw new Error(`WP returned invalid JSON.`);
        }

        const parsed = schema.safeParse(rawData);
        if (!parsed.success) {
          console.error(`🚨 [WP API Error] Schema Parse Failed for ${url.toString()}`, parsed.error);
          throw new Error("WordPress returned an invalid schema format");
        }

        this.unavailableUntil = 0;
        return { data: parsed.data, response };
      } catch (error) {
        const isPermanentHttpError = error instanceof WordPressHttpError && error.status >= 400 && error.status < 500;
        if (isPermanentHttpError) {
          throw error;
        }
        if (attempt === retries) {
          this.unavailableUntil = Date.now() + UNAVAILABLE_BACKEND_COOLDOWN_MS;
          // FIX: Pass the error object to console.error so it is visible in the terminal
          console.error(`🚨 [WP Adapter Final Failure] Could not fetch ${url.pathname}. Reason:`, error);
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
    const author = article._embedded?.author?.[0] || {};
    const featuredMedia = article._embedded?.["wp:featuredmedia"]?.[0] || {};
    const termsArray = article._embedded?.["wp:term"] ?? [];

    let categoryObj: { name?: string; description?: string } = {};
    let tagsObj: Array<{ name?: string }> = [];

    termsArray.forEach((termGroup: Array<{ taxonomy?: string; name?: string }>) => {
      if (!termGroup || termGroup.length === 0) return;
      if (termGroup[0].taxonomy === "category") {
        categoryObj = termGroup[0];
      } else if (termGroup[0].taxonomy === "post_tag") {
        tagsObj = termGroup;
      }
    });

    const publishedAt = toIsoDate(article.date);

    let finalImageUrl = featuredMedia.source_url;
    if (featuredMedia.media_details?.sizes?.large?.source_url) {
      finalImageUrl = featuredMedia.media_details.sizes.large.source_url;
    } else if (featuredMedia.media_details?.sizes?.medium_large?.source_url) {
      finalImageUrl = featuredMedia.media_details.sizes.medium_large.source_url;
    }

    // FIX: Extract SEO Metadata from Yoast or RankMath if available
    let seoExcerpt = stripCmsExcerpt(article.excerpt);
    const seoMetadata = article as WpArticle & {
      yoast_head_json?: { description?: string };
      rank_math_seo?: { description?: string };
    };
    if (seoMetadata.yoast_head_json?.description) {
      seoExcerpt = cleanText(seoMetadata.yoast_head_json.description);
    } else if (seoMetadata.rank_math_seo?.description) {
      seoExcerpt = cleanText(seoMetadata.rank_math_seo.description);
    }

    return {
      id: String(article.id),
      slug: article.slug,
      title: cleanText(article.title || "Untitled story"),
      content: this.cleanHtml(article.content),
      excerpt: seoExcerpt,
      publishedAt,
      publishedAtIso: publishedAt,
      readTime: estimateReadTime(article.content),
      author: cleanText(author.name || "DailySamachar Desk"),
      authorSlug: author.slug ?? undefined,
      image: toSafeImageUrl(finalImageUrl),
      imageUrl: toSafeImageUrl(finalImageUrl),
      imageAlt: cleanText(featuredMedia.alt_text || article.title || "Daily Samachar news"),
      category: cleanText(categoryObj.name || "News"),
      updatedAt: article.modified ? toIsoDate(article.modified) : publishedAt,
      tags: tagsObj.map((tag) => cleanText(tag.name)),
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

    if (params.categorySlug && !category) {
      console.warn(`⚠️ [WP Adapter] Category slug '${params.categorySlug}' not found.`);
      return { data: [], totalPages: 0 };
    }

    if (category) url.searchParams.set("categories", String(category.id));
    if (authorId) url.searchParams.set("author", String(authorId));
    if (tag) url.searchParams.set("tags", String(tag.id));

    try {
      const result = await this.fetchJson(url, wpArticleArraySchema, ["articles"]);

      const headerTotalPages = result.response.headers.get("X-WP-TotalPages");
      let totalPages = 1;
      if (headerTotalPages) {
        const parsed = parseInt(headerTotalPages, 10);
        totalPages = !isNaN(parsed) && parsed > 0 ? parsed : 1;
      }

      return {
        data: result.data.map((article) => this.mapArticle(article)),
        totalPages,
      };
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getPosts API Failed] URL: ${url.toString()}`, error);
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
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getPostBySlug Failed] slug: ${slug}`, error);
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
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getCategories Failed]`, error);
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
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getCategoryBySlug Failed] slug: ${slug}`, error);
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
        name: cleanText(author.name || "Unknown Author"),
        bio: author.description ? cleanText(author.description) : undefined,
        expertise: [],
        avatar: author.avatar_urls?.["96"] || "",
      };
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getAuthorBySlug Failed] slug: ${slug}`, error);
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
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getTagBySlug Failed] slug: ${slug}`, error);
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

      const headerTotalPages = result.response.headers.get("X-WP-TotalPages");
      let totalPages = 1;
      if (headerTotalPages) {
        const parsed = parseInt(headerTotalPages, 10);
        totalPages = !isNaN(parsed) && parsed > 0 ? parsed : 1;
      }

      return {
        data: result.data.map((article) => this.mapArticle(article)),
        totalPages,
      };
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [searchPosts Failed] query: ${query}`, error);
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

        const headerTotalPages = result.response.headers.get("X-WP-TotalPages");
        if (headerTotalPages) {
          const parsed = parseInt(headerTotalPages, 10);
          totalPages = !isNaN(parsed) && parsed > 0 ? parsed : 1;
        }
        page += 1;
      }

      return entries;
    } catch (error) {
      // FIX: Added error payload to console.error
      console.error(`🚨 [getPostSitemapEntries Failed]`, error);
      return [];
    }
  }
}

export const wpAdapter = new WordPressAdapter();
