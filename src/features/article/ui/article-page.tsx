import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";

export interface ArticlePageProps {
  article: Article;
  related: Article[];
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function ArticleBody({ article }: { article: Article }) {
  if (typeof article.content === "string") {
    return <SanitizedHtml html={article.content || article.excerpt || "This story has no body copy yet."} className="prose-readable text-ink dark:text-gray-200" />;
  }

  const blocks = article.content ?? [{ type: "paragraph" as const, value: article.excerpt || "This story has no body copy yet." }];
  return (
    <div className="prose-readable text-ink dark:text-gray-200">
      {blocks.map((block, index) => {
        if (block.type === "heading") return <SanitizedHtml key={index} as="h2" html={block.value} className="editorial mt-10 text-3xl font-bold" />;
        if (block.type === "quote") return <SanitizedHtml key={index} as="blockquote" html={block.value} className="editorial my-9 border-l-2 border-signal pl-5 text-3xl font-medium leading-tight" />;
        return <SanitizedHtml key={index} html={block.value} className="mt-6 leading-relaxed" />;
      })}
    </div>
  );
}

export function ArticlePage({ article, related }: ArticlePageProps) {
  const title = article.title || "Untitled story";
  const author = article.author || "DailySamachar Desk";

  return (
    <main>
      <article>
        <header className="border-b border-line dark:border-gray-800">
          <div className="container-page max-w-5xl py-10 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <Link href={"/category/" + article.category.toLowerCase().replaceAll(" ", "-")} className="kicker hover:underline focus-visible:ring-2 focus-visible:ring-focus">{article.category}</Link>
              <h1 className="editorial mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl dark:text-gray-100">
                <SanitizedHtml as="span" html={title} />
              </h1>
              <SanitizedHtml html={article.excerpt || ""} className="mt-5 max-w-3xl text-lg leading-relaxed text-muted" />
              <div className="mt-7 flex flex-wrap items-center gap-3 border-y border-line py-4 text-sm text-muted dark:border-gray-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft font-bold text-ink dark:bg-gray-800 dark:text-gray-100">{author.charAt(0).toUpperCase()}</span>
                <span className="font-semibold text-ink dark:text-gray-100">{author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </div>
            </div>
          </div>
        </header>

        <div className="container-page py-8">
          {article.image && (
            <figure className="relative mx-auto aspect-video max-w-6xl overflow-hidden rounded-2xl bg-soft dark:bg-gray-900">
              <Image src={article.image} alt={article.imageAlt || title} fill priority sizes="(max-width: 768px) 100vw, 1100px" className="object-cover" />
              {article.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-black/65 px-4 py-3 text-sm text-white">{article.caption}</figcaption>}
            </figure>
          )}
        </div>

        <div className="container-page grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 rounded-xl border-l-2 border-signal bg-soft p-5 dark:bg-gray-900">
              <p className="text-xs font-bold tracking-widest text-signal">IN BRIEF</p>
              <SanitizedHtml html={article.excerpt || "A considered report from the DailySamachar newsroom."} className="mt-2 text-sm leading-relaxed text-ink dark:text-gray-200" />
            </div>
            <ArticleBody article={article} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Related stories">
            <div className="border-t border-line pt-4 dark:border-gray-800">
              <p className="kicker">Continue reading</p>
              <div className="mt-3 space-y-4">
                {related.map((story) => (
                  <div key={story.id} className="border-b border-line pb-4 last:border-0 dark:border-gray-800">
                    <Link href={"/news/" + story.slug} className="editorial text-lg font-bold leading-tight text-ink hover:text-signal dark:text-gray-100">
                      <SanitizedHtml as="span" html={story.title} />
                    </Link>
                    <p className="mt-2 text-xs text-muted">{formatDate(story.publishedAt)}</p>
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
