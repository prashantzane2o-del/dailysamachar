import { articles, authors } from "@/services/news/content";
export async function getAuthorBySlug(slug: string) { return authors.find(author => author.slug === slug) ?? null; }
export async function getArticlesByAuthor(slug: string) { return articles.filter(article => article.authorSlug === slug); }
