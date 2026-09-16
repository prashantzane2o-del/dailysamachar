// src/app/[locale]/category/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getLocalizedPath } from "@/i18n/path";
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { Container, Section } from "@/components/layout/layout";
import { AdSlot } from "@/widgets/ads/ad-slot";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await cmsApi.getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | DailySamachar" };
  }

  return {
    title: `${category.name} News - Latest Updates | DailySamachar`,
    description: category.description || `Read the latest news, updates, and articles about ${category.name}.`,
    alternates: {
      canonical: `${getLocalizedPath(locale, `/category/${category.slug}`)}`,
      languages: {
        en: `/category/${category.slug}`,
        hi: `/hi/category/${category.slug}`,
      },
    },
    openGraph: {
      title: `${category.name} News`,
      description: category.description || `Latest ${category.name} news.`,
      url: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "")}${getLocalizedPath(locale, `/category/${category.slug}`)}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  const t = await getTranslations({ locale, namespace: "common" });

  const category = await cmsApi.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { data: articles, totalPages } = await cmsApi.getArticleCollection({
    categorySlug: slug,
    page: currentPage,
    perPage: 12,
  });

  return (
    <main className="bg-paper min-h-screen dark:bg-gray-950">
      <Section className="pt-8 pb-16 md:pt-12">
        <Container>
          <header className="border-line mb-10 border-b pb-6 dark:border-gray-800">
            <p className="kicker text-signal mb-2" aria-hidden="true">
              {t("category")}
            </p>
            <h1 className="editorial text-ink text-4xl font-bold capitalize sm:text-5xl dark:text-gray-100">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted mt-4 max-w-2xl text-lg dark:text-gray-400">{category.description}</p>
            )}
          </header>

          {articles.length === 0 ? (
            <div
              className="border-line text-muted rounded-xl border border-dashed p-16 text-center dark:border-gray-800"
              role="status"
              aria-live="polite"
            >
              <p className="text-lg">{t("noArticlesFound")}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              <AdSlot placement="inline" className="mt-12" />

              {totalPages > 1 && (
                <nav
                  className="border-line mt-16 flex items-center justify-center gap-4 border-t pt-8 dark:border-gray-800"
                  aria-label="Pagination Navigation"
                >
                  {currentPage > 1 ? (
                    <Link
                      href={`/category/${slug}?page=${currentPage - 1}`}
                      aria-label={`Go to previous page, page ${currentPage - 1}`}
                      className="border-line text-ink focus-visible:ring-primary flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      &larr; {t("previous")}
                    </Link>
                  ) : (
                    <div className="w-25" aria-hidden="true" />
                  )}

                  <span className="text-muted text-sm font-medium" aria-current="page">
                    <span className="sr-only">Currently on </span>
                    {t("page")} {currentPage} {t("of")} {totalPages}
                  </span>

                  {currentPage < totalPages ? (
                    <Link
                      href={`/category/${slug}?page=${currentPage + 1}`}
                      aria-label={`Go to next page, page ${currentPage + 1}`}
                      className="border-line text-ink focus-visible:ring-primary flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      {t("next")} &rarr;
                    </Link>
                  ) : (
                    <div className="w-25" aria-hidden="true" />
                  )}
                </nav>
              )}
            </>
          )}
        </Container>
      </Section>
    </main>
  );
}
