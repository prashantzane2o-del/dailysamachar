export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  imageAlt?: string; // ADDED: For screen reader accessibility (WCAG 2.2 AA)
  author: string;
  authorSlug?: string;
  publishedAt: string;
  publishedAtIso?: string; // ADDED: For semantic <time dateTime="..."> tags
  readTime?: string;
};