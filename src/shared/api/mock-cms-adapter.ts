import type { CmsAdapter, CmsArticleDto } from "@/shared/types/cms";
import { articles } from "@/services/news/content";
function toDto(article: typeof articles[number]): CmsArticleDto {
  const content = Array.isArray(article.content)
    ? article.content.map((block) => block.value).join("\n\n")
    : article.content;

  return { id: article.id, slug: article.slug ?? article.id, title: article.title, excerpt: article.excerpt, content, featuredImage: { url: article.image, alt: article.title, caption: article.caption }, categories: [{ name: article.category, slug: article.category.toLowerCase() }], tags: article.tags?.map(tag => ({ name: tag, slug: tag.toLowerCase().replaceAll(" ", "-") })) ?? [], author: { name: article.author, slug: article.authorSlug ?? article.author.toLowerCase().replaceAll(" ", "-") }, date: article.publishedAt, modified: article.updatedAt, readingTime: Number.parseInt(article.readTime ?? "", 10) || 4 };
}
export const mockCmsAdapter: CmsAdapter = { async getArticle(slug) { return articles.find(article => article.slug === slug) ? toDto(articles.find(article => article.slug === slug)!) : null; }, async listArticles(query = {}) { const lower = query.query?.toLowerCase(); const filtered = articles.filter(article => (!query.category || article.category.toLowerCase() === query.category.toLowerCase()) && (!query.author || article.authorSlug === query.author) && (!lower || `${article.title} ${article.category} ${article.tags?.join(" ")}`.toLowerCase().includes(lower))); return { nodes: filtered.map(toDto) }; } };
