import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { getLocalizedPath } from "@/i18n/path";

type NestedCategoryRouteProps = { params: Promise<{ locale: string; slug: string; subslug: string }> };
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");

export const revalidate = 60;

export async function generateMetadata({ params }: NestedCategoryRouteProps): Promise<Metadata> {
  const { slug, subslug, locale } = await params;
  const category = (await cmsApi.getCategoryBySlug(subslug)) || (await cmsApi.getCategoryBySlug(slug));
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.title} News`,
    description: category.description || `${category.title} news from DailySamachar.`,
    alternates: { canonical: `${siteUrl}${getLocalizedPath(locale, `/category/${slug}/${subslug}`)}` },
  };
}

export default async function NestedCategoryPage({ params }: NestedCategoryRouteProps) {
  const { slug, subslug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const category = (await cmsApi.getCategoryBySlug(subslug)) || (await cmsApi.getCategoryBySlug(slug));
  if (!category) notFound();

  const posts = await cmsApi.getArticles({ categorySlug: category.slug, perPage: 12 });
  const categoryPath = `/category/${slug}/${subslug}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${siteUrl}${getLocalizedPath(locale, "/")}` },
          { name: category.title, url: `${siteUrl}${getLocalizedPath(locale, categoryPath)}` },
        ]}
      />
      <main>
        <section className="border-line bg-soft border-b dark:border-gray-800 dark:bg-gray-900">
          <div className="container-page py-12 sm:py-16">
            <p className="kicker">{t("section")}</p>
            <h1 className="editorial text-ink mt-3 text-5xl font-bold tracking-tight dark:text-gray-100">
              {category.title}
            </h1>
            {category.description && (
              <p className="text-muted mt-4 max-w-2xl text-lg leading-relaxed">{category.description}</p>
            )}
          </div>
        </section>
        <section className="container-page py-10 sm:py-14" aria-labelledby="nested-category-stories-heading">
          <h2 id="nested-category-stories-heading" className="editorial text-ink text-3xl font-bold dark:text-gray-100">
            {category.title} · {t("title")}
          </h2>
          {posts.length === 0 ? (
            <p className="text-muted py-16 text-center text-lg">{t("noNews")}</p>
          ) : (
            <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} article={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
