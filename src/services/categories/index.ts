import { categories } from "@/services/news/content";
export async function getCategoryBySlug(slug: string) { return categories.find(category => category.slug === slug) ?? null; }
