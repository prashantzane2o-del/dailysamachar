import type { WPPost, Article } from "../model/types";

/**
 * Transforms raw WordPress REST API data into our clean internal FSD Article model.
 * Using the Adapter Pattern ensures our UI components never depend on WordPress-specific JSON structures.
 */
export function mapWPPostToArticle(wpPost: WPPost, locale: string = "en"): Article {
  // 1. Safely extract Featured Image from the _embedded object
  const featuredMedia = wpPost._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url;
  const imageAlt = featuredMedia?.alt_text || wpPost.title.rendered;

  // 2. Safely extract Author info
  const authorData = wpPost._embedded?.author?.[0];

  // 3. Safely extract Category (Taxonomy)
  const categoryData = wpPost._embedded?.["wp:term"]?.[0]?.[0];

  // 4. Map to our strict TypeScript interface
  return {
    id: String(wpPost.id),
    slug: wpPost.slug,

    title: wpPost.title.rendered,
    excerpt: wpPost.excerpt.rendered,
    content: wpPost.content.rendered,

    publishedAt: wpPost.date,
    updatedAt: wpPost.modified,
    locale: locale,

    author: {
      name: authorData?.name || "DailySamachar Desk",
      avatar: authorData?.avatar_urls?.["96"], // 96px avatar size
    },

    category: {
      name: categoryData?.name || "News",
      slug: categoryData?.slug || "news",
    },
    tags: [],
    readingMinutes: 4,

    // Only include featuredImage if it exists to avoid undefined errors in UI
    ...(imageUrl && {
      featuredImage: {
        url: imageUrl,
        alt: imageAlt,
        width: featuredMedia?.media_details?.width,
        height: featuredMedia?.media_details?.height,
      },
    }),
  };
}
