// src/shared/api/wordpress-schemas.ts
import { z } from "zod";

// ============================================================================
// SHARED WORDPRESS SCHEMAS (Rendered & Embedded)
// ============================================================================

const wpRenderedStringSchema = z.object({
  rendered: z.string().optional().catch(""),
});

const wpMediaDetailsSchema = z.object({
  sizes: z
    .record(
      z.string(),
      z.object({
        source_url: z.string().url().optional().catch(undefined),
        width: z.number().optional().catch(undefined),
        height: z.number().optional().catch(undefined),
      })
    )
    .optional()
    .catch(undefined),
}).optional().catch(undefined);

const wpFeaturedMediaSchema = z.object({
  id: z.number().optional().catch(undefined),
  source_url: z.string().url().optional().catch(undefined),
  alt_text: z.string().optional().catch(""),
  caption: wpRenderedStringSchema.optional().catch(undefined),
  media_details: wpMediaDetailsSchema,
});

const wpTermSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
});

const wpEmbeddedAuthorSchema = z.object({
  id: z.number().optional().catch(undefined),
  name: z.string().optional().catch(""),
  slug: z.string().optional().catch(""),
  description: z.string().optional().catch(""),
  avatar_urls: z.record(z.string(), z.string().url()).optional().catch(undefined),
});

const wpEmbeddedSchema = z.object({
  author: z.array(wpEmbeddedAuthorSchema).optional().catch(undefined),
  "wp:featuredmedia": z.array(wpFeaturedMediaSchema).optional().catch(undefined),
  "wp:term": z.array(z.array(wpTermSchema)).optional().catch(undefined),
});

// ============================================================================
// STANDARD POST & ARTICLE SCHEMAS
// ============================================================================

export const wpArticleSchema = z.object({
  id: z.number(),
  date: z.string().optional().catch(""),
  date_gmt: z.string().optional().catch(""),
  modified: z.string().optional().catch(""),
  modified_gmt: z.string().optional().catch(""),
  slug: z.string(),
  status: z.string().optional().catch(""),
  type: z.string().optional().catch(""),
  link: z.string().url().optional().catch(""),
  title: wpRenderedStringSchema.optional().catch({ rendered: "" }),
  content: wpRenderedStringSchema.optional().catch({ rendered: "" }),
  excerpt: wpRenderedStringSchema.optional().catch({ rendered: "" }),
  _embedded: wpEmbeddedSchema.optional().catch(undefined),
  yoast_head_json: z.object({ description: z.string().optional().catch("") }).optional().catch(undefined),
  rank_math_seo: z.object({ description: z.string().optional().catch("") }).optional().catch(undefined),
});

// SAFE PARSING: Prevent entire array crash on single item failure
export const wpArticleArraySchema = z.any().transform((arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.reduce((acc: WpArticle[], item) => {
    const parsed = wpArticleSchema.safeParse(item);
    if (parsed.success) acc.push(parsed.data);
    else console.warn("[Zod] Dropped an invalid WordPress post");
    return acc;
  }, []);
});

export type WpArticle = z.infer<typeof wpArticleSchema>;

// ============================================================================
// CATEGORY & AUTHOR SCHEMAS
// ============================================================================

export const wpCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().catch(""),
  count: z.number().optional().catch(0),
});

export type WpCategory = z.infer<typeof wpCategorySchema>;

export const wpAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().catch(""),
  avatar_urls: z.record(z.string(), z.string().url()).optional().catch(undefined),
});

// ============================================================================
// SITEMAP SCHEMAS
// ============================================================================

export const wpPostSitemapSchema = z.object({
  id: z.number().optional().catch(undefined),
  slug: z.string(),
  date: z.string().optional().catch(""),
  date_gmt: z.string().optional().catch(""),
  modified: z.string().optional().catch(""),
  modified_gmt: z.string().optional().catch(""),
});

export const wpPostSitemapArraySchema = z.any().transform((arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.reduce((acc: z.infer<typeof wpPostSitemapSchema>[], item) => {
    const parsed = wpPostSitemapSchema.safeParse(item);
    if (parsed.success) acc.push(parsed.data);
    return acc;
  }, []);
});

// ============================================================================
// WEB STORIES SCHEMAS (BULLETPROOF FIX)
// ============================================================================

export const wpWebStorySchema = z.object({
  id: z.number().optional().catch(undefined),
  date: z.string().optional().catch(""),
  modified: z.string().optional().catch(""),
  slug: z.string().optional().catch("story"),
  link: z.string().url().optional().catch(""),
  title: wpRenderedStringSchema.optional().catch({ rendered: "Untitled Story" }),
  content: wpRenderedStringSchema.optional().catch({ rendered: "" }),
  
  // Custom Web Stories Fields
  poster_image_url: z.string().url().optional().catch(undefined),
  story_poster: z.object({
    url: z.string().url().optional().catch(undefined)
  }).optional().catch(undefined),
  
  // Embedded data (For featured image fallback)
  _embedded: wpEmbeddedSchema.optional().catch(undefined),
}).passthrough(); // Ensures Zod doesn't reject unexpected fields sent by the plugin

// SAFE PARSING: Ensure an array is returned even if WordPress sends weird data
export const wpWebStoryArraySchema = z.any().transform((arr) => {
  if (!Array.isArray(arr)) {
    console.warn("[Zod] Web Stories API did not return an array:", arr);
    return [];
  }
  return arr.reduce((acc: WpWebStory[], item) => {
    const parsed = wpWebStorySchema.safeParse(item);
    if (parsed.success) {
      acc.push(parsed.data);
    } else {
      console.warn("[Zod] Dropped invalid Web Story Item:", parsed.error);
    }
    return acc;
  }, []);
});

export type WpWebStory = z.infer<typeof wpWebStorySchema>;