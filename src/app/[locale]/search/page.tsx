// src/app/[locale]/search/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";
import { getLocalizedPath } from "@/i18n/path";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type SearchPageProps = { params: Promise<{ locale: string }>; searchParams: SearchParams };

function getQuery(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const query = getQuery(resolvedSearchParams.q);
  const t = await getTranslations({ locale, namespace: "search" });
  
  return { 
    title: query ? t("resultsFor", { query }) : t("label"), 
    robots: { index: false, follow: true } 
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const resolvedSearchParams = await searchParams;
  const query = getQuery(resolvedSearchParams.q);
  const t = await getTranslations({ locale, namespace: "search" });

  // SECURITY & PERFORMANCE: Require at least 3 characters before hitting the database
  const isQueryValid = query.length >= 3;

  const posts = isQueryValid
    ? await cmsApi.searchArticles(query).catch((error: unknown) => {
        console.error("Failed to search WordPress posts", error);
        return [];
      })
    : [];

  return (
    <main className="container-page py-10 sm:py-14">
      <div className="border-line border-b pb-6 dark:border-gray-800">
        <p className="kicker">{t("label")}</p>
        <h1 className="editorial text-ink mt-3 text-4xl font-bold tracking-tight sm:text-5xl dark:text-gray-100">
          {query ? t("resultsFor", { query }) : t("title")}
        </h1>
        <form action={getLocalizedPath(locale, "/search")} className="mt-6 flex max-w-2xl gap-2">
          <label htmlFor="site-search" className="sr-only">
            {t("label")}
          </label>
          <input
            id="site-search"
            name="q"
            defaultValue={query}
            placeholder={t("placeholder")}
            className="border-line bg-paper text-ink placeholder:text-muted focus-visible:border-signal min-w-0 grow rounded-lg border px-4 py-3 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-ink text-paper hover:bg-signal focus-visible:ring-focus rounded-lg px-5 py-3 text-sm font-bold focus-visible:ring-2 dark:bg-gray-100 dark:text-gray-900"
          >
            {t("submit")}
          </button>
        </form>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {!query ? (
          <p className="text-muted py-16 text-center text-lg">{t("emptyQuery")}</p>
        ) : !isQueryValid ? (
          <p className="text-muted py-16 text-center text-lg">
            Please enter at least 3 characters to search.
          </p>
        ) : posts.length === 0 ? (
          <p className="text-muted py-16 text-center text-lg">{t("noResults")}</p>
        ) : (
          <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}