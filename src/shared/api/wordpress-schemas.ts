// src/shared/api/wordpress-schemas.ts
import { z } from "zod";

// Helper for safe fallbacks (never fails)
const safeString = (fallback = "") =>
  z.any().optional().transform((v) => (typeof v === "string" ? v : fallback));

export const wpImageSchema = z.any().transform((v) => {
  if (v && typeof v === "object") return v;
  return { source_url: "", alt_text: "" };
});

export const wpAuthorSchema = z.any().transform((v) => {
  if (v && typeof v === "object") {
    return {
      id: Number(v.id) || 0,
      name: String(v.name || "DailySamachar Desk"),
      slug: String(v.slug || ""),
      description: String(v.description || ""),
      avatar_urls: v.avatar_urls || {},
    };
  }
  return { id: 0, name: "DailySamachar Desk", slug: "", description: "", avatar_urls: {} };
});

export const wpCategorySchema = z.any().transform((v) => {
  if (v && typeof v === "object") {
    return {
      id: Number(v.id) || 0,
      name: String(v.name || "News"),
      slug: String(v.slug || "news"),
      description: String(v.description || ""),
      count: Number(v.count) || 0,
    };
  }
  return { id: 0, name: "News", slug: "news", description: "", count: 0 };
});

// BULLETPROOF Article Schema: Extracts what it needs, ignores the rest, never crashes
export const wpArticleSchema = z
  .object({
    // IDs and slugs are required identity fields. A post with either missing
    // field is not safe to render or link, so the array schema skips it.
    id: z.number().int().positive(),
    slug: z.string().min(1),
    date: safeString(new Date().toISOString()),
    modified: safeString(new Date().toISOString()),
    title: z.any().optional().transform((v) => v?.rendered ?? "Untitled"),
    content: z.any().optional().transform((v) => v?.rendered ?? ""),
    excerpt: z.any().optional().transform((v) => v?.rendered ?? ""),
    _embedded: z.any().optional().transform((v) => v ?? {}),
  })
  .passthrough();

// Advanced Array Schema: Loudly warns in console instead of hiding errors
export const wpArticleArraySchema = z.any().transform((arr) => {
  if (!Array.isArray(arr)) {
    console.error("🚨 [WP Schema Error] API did not return an array. Received:", typeof arr, arr);
    return [];
  }
  return arr.reduce<z.infer<typeof wpArticleSchema>[]>((validPosts, item) => {
    const parsed = wpArticleSchema.safeParse(item);
    if (parsed.success) {
      validPosts.push(parsed.data);
    } else {
      console.warn("🚨 [WP Schema Warning] Skipped a malformed post:", parsed.error.format());
    }
    return validPosts;
  }, []);
});

// Sitemap Schema
export const wpPostSitemapArraySchema = z.any().transform((arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.reduce<Array<{ id: number; slug: string; date: string; modified: string }>>((valid, item) => {
    if (item && typeof item === "object" && item !== null && "id" in item && "slug" in item) {
      const record = item as Record<string, unknown>;
      valid.push({
        id: Number(record.id) || 0,
        slug: String(record.slug || ""),
        date: String(record.date || new Date().toISOString()),
        modified: String(record.modified || new Date().toISOString()),
      });
    }
    return valid;
  }, []);
});

export type WpArticle = z.infer<typeof wpArticleSchema>;
export type WpCategory = ReturnType<typeof wpCategorySchema.parse>;
export type WpPostSitemapEntry = ReturnType<typeof wpPostSitemapArraySchema.parse>[number];
