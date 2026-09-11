import { cmsApi } from "@/shared/api/cms";
import type { Article as NewsArticle } from "@/types/news";
import type { CmsAdapter, CmsArticleDto } from "@/shared/types/cms";
import { createArticleRepository } from "./repository";

function toArticleDto(article: NewsArticle): CmsArticleDto {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: typeof article.content === "string" ? article.content : undefined,
    featuredImage: article.image ? { url: article.image, alt: article.imageAlt, caption: article.caption } : undefined,
    categories: [
      {
        name: article.category,
        slug: article.category.toLowerCase().replace(/\s+/g, "-"),
      },
    ],
    tags: (article.tags ?? []).map((tag) => ({
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, "-"),
    })),
    author: {
      name: article.author,
      slug: article.authorSlug ?? article.author.toLowerCase().replace(/\s+/g, "-"),
    },
    date: article.publishedAt,
    modified: article.updatedAt,
  };
}

const articleCmsAdapter: CmsAdapter = {
  async getArticle(slug) {
    const article = await cmsApi.getArticleBySlug(slug);
    return article ? toArticleDto(article) : null;
  },

  async listArticles(query = {}) {
    if (query.query) {
      const result = await cmsApi.searchArticles(query.query);
      return { nodes: result.map(toArticleDto) };
    }

    const result = await cmsApi.getArticles({
      categorySlug: query.category,
      authorSlug: query.author,
      perPage: query.limit,
    });

    return { nodes: result.map(toArticleDto) };
  },
};

export const articleRepository = createArticleRepository(articleCmsAdapter);
