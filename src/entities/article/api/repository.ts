import type { CmsAdapter } from "@/shared/types/cms";
import { mapCmsArticle } from "./mapper";
import type { ArticlePage, ArticleQuery } from "../model/types";

export interface ArticleRepository {
  getBySlug(slug: string): Promise<ReturnType<typeof mapCmsArticle> | null>;
  list(query?: ArticleQuery): Promise<ArticlePage>;
}

export function createArticleRepository(adapter: CmsAdapter): ArticleRepository {
  return {
    async getBySlug(slug) {
      const dto = await adapter.getArticle(slug);
      return dto ? mapCmsArticle(dto) : null;
    },
    async list(query) {
      const result = await adapter.listArticles(query);
      return {
        items: result.nodes.map(mapCmsArticle),
        nextCursor: result.pageInfo?.endCursor,
      };
    },
  };
}
