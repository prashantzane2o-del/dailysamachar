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
  id: string;
  slug: string;
  name: string;
  title: string;
  description?: string;
  image: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  imageUrl?: string;
  imageAlt?: string;
  author: string;
  authorSlug?: string;
  publishedAt: string;
  publishedAtIso?: string;
  readTime?: string;
  summary?: string;
  updatedAt?: string;
  views?: string;
  caption?: string;
  tags?: string[];
  content?: string | Array<{ type: "paragraph" | "heading" | "quote"; value: string }>;
};
