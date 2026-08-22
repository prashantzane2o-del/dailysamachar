// Strict internal domain entity for Article
export interface Article {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  tags: Array<{ title: string; slug: string }>;
  readingMinutes: number;
  readingTime?: number;
  locale?: string;
}

export type ArticleQuery = {
  category?: string;
  author?: string;
  query?: string;
  cursor?: string;
};

export type ArticlePage = {
  items: Article[];
  nextCursor?: string;
};

// Raw WordPress REST API Response Types (Headless WP Contract)
export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      avatar_urls?: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
    'wp:term'?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
      }>
    >;
  };
}
