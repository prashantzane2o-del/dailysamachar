import type { CmsArticleDto } from "@/shared/types/cms";
import type { Article } from "../model/types";

export function mapCmsArticle(dto: CmsArticleDto): Article {
  const category = dto.categories[0] ?? { name: "News", slug: "news" };

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt ?? "",
    content: dto.content,
    publishedAt: dto.date,
    updatedAt: dto.modified,
    author: {
      name: dto.author.name,
      avatar: dto.author.avatar,
    },
    category: {
      name: category.name,
      slug: category.slug,
    },
    featuredImage: dto.featuredImage
      ? {
          url: dto.featuredImage.url,
          alt: dto.featuredImage.alt ?? dto.title,
          ...(dto.featuredImage.caption ? { caption: dto.featuredImage.caption } : {}),
        }
      : undefined,
    tags: dto.tags.map((tag) => ({ title: tag.name, slug: tag.slug })),
    readingMinutes: dto.readingTime ?? 4,
    readingTime: dto.readingTime,
  };
}
