import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cmsClient } from "@/shared/api/cms";
import { ArticleCard } from "@/entities/article/ui/article-card";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("homeTitle"), description: t("homeDescription") };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const { data: posts } = await cmsClient.getPosts({ perPage: 12 });

  return (
    <main>
      <section className="border-b border-line bg-paper dark:border-gray-800 dark:bg-gray-950">
        <div className="container-page py-12 sm:py-16">
          <p className="kicker">DailySamachar</p>
          <h1 className="editorial mt-3 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-ink sm:text-6xl dark:text-gray-100">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t("description")}</p>
        </div>
      </section>
      <section className="container-page py-10 sm:py-14" aria-labelledby="latest-stories-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="latest-stories-heading" className="editorial text-3xl font-bold text-ink dark:text-gray-100">{t("title")}</h2>
          <span className="text-sm text-muted">{posts.length} stories</span>
        </div>
        {posts.length === 0 ? (
          <p className="py-16 text-center text-lg text-muted">{t("noNews")}</p>
        ) : (
          <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <ArticleCard key={post.id} article={post} />)}
          </div>
        )}
      </section>
    </main>
  );
}
