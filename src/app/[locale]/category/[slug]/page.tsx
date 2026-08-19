import { notFound } from "next/navigation";
import { CategoryPage } from "@/features/category/components/category-page";
import { getCategoryBySlug } from "@/services/categories";
import { getArticlesByCategory } from "@/services/news";
export default async function CategoryRoute({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug; const [category, articles] = await Promise.all([getCategoryBySlug(slug), getArticlesByCategory(slug)]); if (!category) notFound(); return <CategoryPage category={category} articles={articles}/>; }
