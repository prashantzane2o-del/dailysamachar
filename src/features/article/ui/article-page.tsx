import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { ReadingToolbar } from "@/features/article/ui/reading-toolbar";

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

function ArticleBody({ article }: { article: Article }) {
  if (typeof article.content === "string") {
    return (
      <SanitizedHtml
        html={article.content || article.excerpt || "This story has no body copy yet."}
        className="prose-readable text-ink dark:text-gray-200"
      />
    );
  }
  const blocks = article.content ?? [
    { type: "paragraph" as const, value: article.excerpt || "This story has no body copy yet." },
  ];

  return (
    <div className="prose-readable text-ink dark:text-gray-200">
      {blocks.map((block, index) => {
        if (block.type === "heading")
          return (
            <SanitizedHtml key={index} as="h2" html={block.value} className="editorial mt-10 text-3xl font-bold" />
          );
        if (block.type === "quote")
          return (
            <SanitizedHtml
              key={index}
              as="blockquote"
              html={block.value}
              className="editorial border-signal my-9 border-l-2 pl-5 text-3xl leading-tight font-medium"
            />
          );
        return <SanitizedHtml key={index} html={block.value} className="mt-6 leading-relaxed" />;
      })}
    </div>
  );
} // FIXED: Missing closing bracket here

export async function ArticlePage({ article, related, locale }: ArticlePageProps) {
  const t = await getTranslations({ locale, namespace: "article" });
  const title = article.title || "Untitled story";
  const author = article.author || t("desk");

  return (
    <main>
      <ReadingToolbar
        articleId={article.id}
        articleSlug={article.slug}
        articleTitle={article.title}
        category={article.category}
      />
      <article>
        <header className="border-line border-b dark:border-gray-800">
          <div className="container-page max-w-5xl py-10 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <Link
                href={"/category/" + article.category.toLowerCase().replaceAll(" ", "-")}
                className="kicker focus-visible:ring-focus hover:underline focus-visible:ring-2"
              >
                {article.category}
              </Link>
              <h1 className="editorial text-ink mt-4 text-4xl leading-tight font-bold tracking-tight sm:text-6xl dark:text-gray-100">
                <SanitizedHtml as="span" html={title} />
              </h1>
              <SanitizedHtml
                html={article.excerpt || ""}
                className="text-muted mt-5 max-w-3xl text-lg leading-relaxed"
              />
              <div className="border-line text-muted mt-7 flex flex-wrap items-center gap-3 border-y py-4 text-sm dark:border-gray-800">
                <span className="bg-soft text-ink flex h-10 w-10 items-center justify-center rounded-full font-bold dark:bg-gray-800 dark:text-gray-100">
                  {author.charAt(0).toUpperCase()}
                </span>
                <span className="text-ink font-semibold dark:text-gray-100">{author}</span>
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
            </div>
          </div>
        </header>
        <div className="container-page py-8">
          {article.image && (
            <figure className="bg-soft relative mx-auto aspect-video max-w-6xl overflow-hidden rounded-2xl dark:bg-gray-900">
              <Image
                src={article.image}
                alt={article.imageAlt || title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1100px"
                className="object-cover"
              />
              {article.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-black/65 px-4 py-3 text-sm text-white">
                  {article.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
        <div className="container-page grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="mx-auto w-full max-w-3xl">
            <div className="border-signal bg-soft mb-8 rounded-xl border-l-2 p-5 dark:bg-gray-900">
              <p className="text-signal text-xs font-bold tracking-widest">{t("inBrief")}</p>
              <SanitizedHtml
                html={article.excerpt || "A considered report from the DailySamachar newsroom."}
                className="text-ink mt-2 text-sm leading-relaxed dark:text-gray-200"
              />
            </div>
            <ArticleBody article={article} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Related stories">
            <div className="border-line border-t pt-4 dark:border-gray-800">
              <p className="kicker">{t("continueReading")}</p>
              <div className="mt-3 space-y-4">
                {related.map((story) => (
                  <div key={story.id} className="border-line border-b pb-4 last:border-0 dark:border-gray-800">
                    <Link
                      href={"/news/" + story.slug}
                      className="editorial text-ink hover:text-signal text-lg leading-tight font-bold dark:text-gray-100"
                    >
                      <SanitizedHtml as="span" html={story.title} />
                    </Link>
                    <p className="text-muted mt-2 text-xs">{formatDate(story.publishedAt, locale)}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
