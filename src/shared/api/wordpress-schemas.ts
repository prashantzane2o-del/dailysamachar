// src/shared/api/wordpress-schemas.ts
import { z } from "zod";

// Helper for safe fallbacks (never fails)
const safeString = (fallback = "") => z.string().nullish().catch(fallback).transform(v => v ?? fallback);
const safeNumber = (fallback = 0) => z.number().nullish().catch(fallback).transform(v => v ?? fallback);

export const wpImageSchema = z.object({
  source_url: safeString(),
  alt_text: safeString(),
}).passthrough();

export const wpAuthorSchema = z.object({
  id: safeNumber(),
  name: safeString("DailySamachar Desk"),
  slug: safeString(),
  description: safeString(),
  avatar_urls: z.record(z.string(), z.string()).nullish().catch({}),
}).passthrough();

export const wpCategorySchema = z.object({
  id: safeNumber(),
  name: safeString("News"),
  slug: safeString("news"),
  description: safeString(),
  count: safeNumber(),
}).passthrough();

// AAA-Level Article Schema: Tolerates missing/null fields smoothly
export const wpArticleSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(Number),
  date: safeString(new Date().toISOString()),
  modified: safeString(new Date().toISOString()),
  slug: safeString(""),
  title: z.object({ rendered: safeString("Untitled") }).passthrough().catch({ rendered: "Untitled" }),
  content: z.object({ rendered: safeString("") }).passthrough().catch({ rendered: "" }),
  excerpt: z.object({ rendered: safeString("") }).passthrough().catch({ rendered: "" }),
  _embedded: z.object({
    author: z.array(wpAuthorSchema).nullish().catch([]),
    "wp:featuredmedia": z.array(wpImageSchema).nullish().catch([]),
    "wp:term": z.array(z.array(wpCategorySchema)).nullish().catch([]),
  }).passthrough().nullish().catch({}),
}).passthrough();

// Advanced Array Schema: Filters out bad posts instead of failing the whole batch (Fixed 'any' type error)
export const wpArticleArraySchema = z.array(z.unknown()).transform((arr) => {
  return arr.reduce<z.infer<typeof wpArticleSchema>[]>((validPosts, item) => {
    const parsed = wpArticleSchema.safeParse(item);
    if (parsed.success) {
      validPosts.push(parsed.data);
    } else {
      console.warn("  [WP Schema Warning] Skipped a malformed post:", parsed.error.format());
    }
    return validPosts;
  }, []);
});

// Sitemap Schema (Fixed 'any' type error)
export const wpPostSitemapArraySchema = z.array(z.unknown()).transform((arr) => {
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
export type WpCategory = z.infer<typeof wpCategorySchema>;
export type WpPostSitemapEntry = z.infer<typeof wpPostSitemapArraySchema>[number];