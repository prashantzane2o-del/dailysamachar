import { wpArticleSchema } from "@/shared/api/wordpress-schemas";

/**
 * Utility to strip HTML tags and entities from plain text fields
 */
function stripCmsHtml(html: string | undefined | null): string {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]+>/g, "") // Strip HTML tags
    .replace(/&[^;]+;/g, "") // Strip HTML entities
    .trim();
}

/**
 * Maps a single WordPress post to the CMS application format.
 * Throws an error if the input is completely invalid.
 */
export function mapWordPressPostToCMS(input: unknown) {
  const wpPost = wpArticleSchema.parse(input);

  const featuredMedia = wpPost._embedded?.["wp:featuredmedia"]?.[0];
  const authorData = wpPost._embedded?.author?.[0];

  // wp:term is an array of arrays: [0] = categories, [1] = tags
  const terms = wpPost._embedded?.["wp:term"] ?? [];
  const category = terms[0]?.[0];
  const tags = terms[1] ?? [];

  const imageUrl = featuredMedia?.source_url || "";

  return {
    id: String(wpPost.id),
    slug: wpPost.slug,
    title: stripCmsHtml(wpPost.title?.rendered) || "Untitled",
    excerpt: wpPost.excerpt?.rendered || "",
    content: wpPost.content?.rendered || "",
    publishedAt: wpPost.date,
    image: imageUrl,
    featuredImage: imageUrl
      ? {
          url: imageUrl,
          alt: stripCmsHtml(featuredMedia?.alt_text || wpPost.title?.rendered || "News Image"),
        }
      : undefined,
    author: stripCmsHtml(authorData?.name) || "DailySamachar Desk",
    category: stripCmsHtml(category?.name) || "News",
    tags: tags.map((tag) => stripCmsHtml(tag.name)).filter(Boolean),
  };
}

/**
 * Maps an array of WordPress posts gracefully.
 * If a single post fails validation, it is skipped rather than crashing the whole list.
 */
export function mapWordPressPosts(inputs: unknown[]) {
  if (!Array.isArray(inputs)) return [];

  return inputs.reduce<ReturnType<typeof mapWordPressPostToCMS>[]>((validPosts, input) => {
    // Safe parse prevents the entire array from failing due to one bad article
    const parsed = wpArticleSchema.safeParse(input);

    if (parsed.success) {
      try {
        validPosts.push(mapWordPressPostToCMS(parsed.data));
      } catch (error) {
        console.warn("Failed to map a valid WordPress post:", error);
      }
    } else {
      console.warn("Skipped malformed WordPress post during mapping.");
    }

    return validPosts;
  }, []);
}
