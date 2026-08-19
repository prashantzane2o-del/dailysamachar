export type Author = {
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  expertise: string[];
  avatar: string;
  social?: Record<string, string>;
};

export type Category = {
  slug: string;
  title: string;
  description?: string;
  image: string;
};

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  imageUrl?: string;
  imageAlt?: string; // ADDED: For screen reader accessibility (WCAG 2.2 AA)
  author: string;
  authorSlug?: string;
  publishedAt: string;
  publishedAtIso?: string; // ADDED: For semantic <time dateTime="..."> tags
  readTime?: string;
  summary?: string;
  updatedAt?: string;
  views?: string;
  caption?: string;
  tags?: string[];
  content?: Array<{ type: string; value: string }>;
};
