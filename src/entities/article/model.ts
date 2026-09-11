export interface Author {
  name: string;
  slug: string;
  avatarUrl?: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author?: Author;
  imageUrl?: string;
  category?: string;
}

export interface Article extends ArticleSummary {
  content: string; // Sanitized HTML content from WordPress
  tags: string[];
}
