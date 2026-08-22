import { cmsClient } from "@/shared/api/cms";
import type { Category } from "@/types/news";

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return cmsClient.getCategoryBySlug(slug);
}
