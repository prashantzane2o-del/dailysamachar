import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { stripCmsHtml } from "@/shared/lib/cms-html";
import { ReadingToolbar } from "@/features/article/ui/reading-toolbar";
import { ArticleTranslator } from "@/features/article/ui/article-translator";
import { ArticleComments } from "@/features/article/ui/article-comments";

export interface ArticlePageProps {
  article: Article;
  related: Article[];
  locale: string;
} // FIXED: Missing closing bracket here

function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
} // FIXED: Missing closing bracket here

export async function ArticlePage({ article, related, locale }: ArticlePageProps) {
  const t = await getTranslations({ locale, namespace: "article" });
  const title = article.title || "Untitled story";
  const plainTitle = stripCmsHtml(title) || "Untitled story";
  const author = article.author || t("desk");
  const contentHtml =
    typeof article.content === "string"
      ? article.content
      : (article.content ?? [])
          .map((block) => {
            if (block.type === "heading") return `<h2>${block.value}</h2>`;
            if (block.type === "quote") return `<blockquote>${block.value}</blockquote>`;
            return `<p>${block.value}</p>`;
          })
          .join("") || article.excerpt;

  return (
    <main>
      <ReadingToolbar
        articleId={article.id}
        articleSlug={article.slug}
        articleTitle={article.title}
        category={article.category}
        articleText={stripCmsHtml(`${article.title} ${article.excerpt || ""} ${contentHtml}`)}
        locale={locale}
      />
      <article>
        <header className="border-line border-b dark:border-gray-800">
          <div className="container-page py-5">
            <Link
              href={"/category/" + article.category.toLowerCase().replaceAll(" ", "-")}
              className="kicker focus-visible:ring-focus hover:underline focus-visible:ring-2"
            >
              {article.category}
            </Link>
          </div>
        </header>
        <div className="container-page grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="mx-auto w-full max-w-3xl">
            <ArticleTranslator
              title={plainTitle}
              excerpt={article.excerpt || ""}
              content={contentHtml || ""}
              locale={locale}
              inBriefLabel={t("inBrief")}
              metadata={
                <>
                  <div className="border-line text-muted mt-7 flex flex-wrap items-center gap-3 border-y py-4 text-sm dark:border-gray-800">
                    <span className="bg-soft text-ink flex h-10 w-10 items-center justify-center rounded-full font-bold dark:bg-gray-800 dark:text-gray-100">
                      {author.charAt(0).toUpperCase()}
                    </span>
                    <span className="article-primary-text font-semibold">{author}</span>
                    <span aria-hidden="true"> </span>
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
                    {article.updatedAt && article.updatedAt !== article.publishedAt && (
                      <>
                        <span aria-hidden="true"> </span>
                        <span>
                          {t("updated")} {formatDate(article.updatedAt, locale)}
                        </span>
                      </>
                    )}
                  </div>
                  {article.image && (
                    <figure className="bg-soft relative mt-8 aspect-video overflow-hidden rounded-2xl dark:bg-gray-900">
                      <Image
                        src={article.image}
                        alt={article.imageAlt || title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="bg-black object-contain sm:object-cover"
                      />
                      {article.caption && (
                        <figcaption className="absolute inset-x-0 bottom-0 bg-black/65 px-4 py-3 text-sm text-white">
                          {article.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </>
              }
            />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Related stories">
            <div className="border-line border-t pt-4 dark:border-gray-800">
              <p className="kicker">{t("continueReading")}</p>
              <div className="mt-3 space-y-4">
                {related.map((story) => (
                  <div key={story.id} className="border-line border-b pb-4 last:border-0 dark:border-gray-800">
                    <Link
                      href={"/news/" + story.slug}
                      className="article-related-link editorial hover:text-signal text-lg leading-tight font-bold"
                    >
                      {stripCmsHtml(story.title) || "Untitled story"}
                    </Link>
                    <p className="text-muted mt-2 text-xs">{formatDate(story.publishedAt, locale)}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
      <ArticleComments articleId={article.id} locale={locale} />
    </main>
  );
}
