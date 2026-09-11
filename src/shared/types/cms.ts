/**
 * Core Domain Interfaces for the CMS.
 * These types act as a generic contract between the application and ANY data source
 * (WordPress, Mock Data, Contentful, etc.).
 * The UI components should only rely on these types, never on WordPress-specific schemas.
 */

export interface CmsImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface CmsTaxonomy {
  name: string;
  slug: string;
}

export interface CmsAuthor {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
}

/**
 * Article shape consumed by entity UI.
 *
 * The canonical CMS fields are date, featuredImage, and object author.
 * The optional aliases keep the entity UI compatible with the existing CMS
 * client while its route-facing contract is being migrated.
 */
export interface CmsArticle {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  featuredImage?: CmsImage;
  author?: CmsAuthor | string;
  publishedAt?: string;
  image?: string;
  imageAlt?: string;
}

export interface CmsArticleDto {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: CmsImage;
  categories: CmsTaxonomy[];
  tags: CmsTaxonomy[];
  author: CmsAuthor;
  date: string;
  modified?: string;
  readingTime?: number;
}

/**
 * Standardized query parameters for fetching lists of articles.
 */
export interface CmsQuery {
  /** Filter by category slug */
  category?: string;
  /** Filter by author slug */
  author?: string;
  /** Filter by tag slug */
  tag?: string;
  /** Free-text search query */
  query?: string;
  /** Cursor for relay-style pagination (Next/Prev) */
  cursor?: string;
  /** Maximum number of items to return */
  limit?: number;
  /** Number of items to skip (for offset-based pagination) */
  offset?: number;
}

/**
 * Standardized response format for lists of articles.
 * Includes optional metadata for pagination.
 */
export interface CmsCollection {
  nodes: CmsArticleDto[];
  pageInfo?: {
    hasNextPage: boolean;
    endCursor?: string;
  };
  totalCount?: number;
}

/**
 * The unified contract that any CMS Adapter (WordPress, Mock, etc.) MUST implement.
 */
export interface CmsAdapter {
  /** Fetch a single article by its URL slug */
  getArticle(slug: string): Promise<CmsArticleDto | null>;

  /** Fetch a collection of articles based on query parameters */
  listArticles(query?: CmsQuery): Promise<CmsCollection>;
}
