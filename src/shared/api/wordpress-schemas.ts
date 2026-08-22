import { z } from "zod";

export const wpImageSchema = z.object({
  source_url: z.string().url(),
  alt_text: z.string().optional().default(""),
});

export const wpAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  // In Zod v4, z.record requires both key and value schemas if specifying the key type
  avatar_urls: z.record(z.string(), z.string().url()).optional(),
});

export const wpCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().default(""),
  count: z.number().optional().default(0),
});

export const wpArticleSchema = z.object({
  id: z.number(),
  date: z.string(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
  excerpt: z.object({
    rendered: z.string(),
  }),
  _embedded: z
    .object({
      author: z.array(wpAuthorSchema).optional(),
      "wp:featuredmedia": z.array(wpImageSchema).optional(),
      "wp:term": z.array(z.array(wpCategorySchema)).optional(),
    })
    .optional(),
});

export const wpArticleArraySchema = z.array(wpArticleSchema);

export const wpPostSitemapArraySchema = z.array(
  z.object({
    id: z.number(),
    slug: z.string(),
    date: z.string(),
    modified: z.string(),
  }),
);

export type WpArticle = z.infer<typeof wpArticleSchema>;
export type WpCategory = z.infer<typeof wpCategorySchema>;
export type WpPostSitemapEntry = z.infer<typeof wpPostSitemapArraySchema>[number];
