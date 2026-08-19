export type Article = { id: string; slug: string; title: string; summary: string; body: string; image: { src: string; alt: string; caption?: string }; category: { title: string; slug: string }; tags: Array<{ title: string; slug: string }>; author: { name: string; slug: string; bio?: string; avatar?: string }; publishedAt: string; updatedAt?: string; readingMinutes: number };
export type ArticleQuery = { category?: string; author?: string; query?: string; cursor?: string };
export type ArticlePage = { items: Article[]; nextCursor?: string };
