import { wpArticleSchema } from "@/shared/api/wordpress-schemas";

export function mapWordPressPostToCMS(input: unknown) {
  const wpPost = wpArticleSchema.parse(input);
  const featuredMedia = wpPost._embedded?.["wp:featuredmedia"]?.[0];
  const authorData = wpPost._embedded?.author?.[0];
  const category = wpPost._embedded?.["wp:term"]?.[0]?.[0];
  const imageUrl = featuredMedia?.source_url || "";

  return {
    id: String(wpPost.id),
    slug: wpPost.slug,
    title: wpPost.title.rendered || "",
    excerpt: wpPost.excerpt.rendered || "",
    content: wpPost.content.rendered || "",
    publishedAt: wpPost.date,
    image: imageUrl,
    featuredImage: imageUrl ? { url: imageUrl, alt: featuredMedia?.alt_text || wpPost.title.rendered } : undefined,
    author: authorData?.name || "Unknown Author",
    category: category?.name || "Uncategorized",
    tags: [],
  };
}

export function mapWordPressPosts(inputs: unknown[]) {
  return inputs.map(mapWordPressPostToCMS);
}
