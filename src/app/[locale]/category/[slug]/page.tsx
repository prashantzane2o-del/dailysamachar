import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cmsClient } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";

export const revalidate = 60;

type CategoryRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await cmsClient.getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return { title: category.title + " News", description: category.description || category.title + " news from DailySamachar." };
}

export default async function CategoryPage({ params }: CategoryRouteProps) {
  const { slug } = await params;
  const category = await cmsClient.getCategoryBySlug(slug);
  if (!category) notFound();

  const { data: posts } = await cmsClient.getPosts({ categorySlug: slug, perPage: 12 });

  return (
    <main>
      <section className="border-b border-line bg-soft dark:border-gray-800 dark:bg-gray-900">
        <div className="container-page py-12 sm:py-16">
          <p className="kicker">Section</p>
          <h1 className="editorial mt-3 text-5xl font-bold tracking-tight text-ink dark:text-gray-100">{category.title}</h1>
          {category.description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{category.description}</p>}
        </div>
      </section>
      <section className="container-page py-10 sm:py-14" aria-labelledby="category-stories-heading">
        <h2 id="category-stories-heading" className="editorial text-3xl font-bold text-ink dark:text-gray-100">Latest {category.title} stories</h2>
        {posts.length === 0 ? (
          <p className="py-16 text-center text-lg text-muted">No articles found in this category yet.</p>
        ) : (
          <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <ArticleCard key={post.id} article={post} />)}
          </div>
        )}
      </section>
    </main>
  );
}
