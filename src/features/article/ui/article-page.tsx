import Image from "next/image";
import { Article, ArticleSummary } from "@/entities/article/model";
import { Container, Section } from "@/components/layout/layout";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { Link } from "@/i18n/routing";

interface ArticlePageProps {
  article: Article;
  related: ArticleSummary[];
}

export function ArticlePage({ article, related }: ArticlePageProps) {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(article.publishedAt));

  return (
    <Section>
      <Container className="max-w-4xl">
        <article className="mx-auto max-w-3xl">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="editorial text-4xl font-black leading-tight text-ink md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="mt-4 text-xl text-muted leading-relaxed">
                {article.excerpt}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between border-b border-t border-line py-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="font-bold text-ink">
                  By {article.author?.name || "DailySamachar Desk"}
                </div>
                <span className="text-line">|</span>
                <time dateTime={article.publishedAt} className="text-muted font-medium">
                  {formattedDate}
                </time>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <figure className="mb-10 overflow-hidden rounded-xl bg-soft">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={450}
                className="w-full object-cover"
                priority // Preload LCP image
              />
            </figure>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-ink">
            <SanitizedHtml html={article.content} />
          </div>
        </article>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <aside className="mt-16 border-t-[6px] border-ink pt-8">
            <h2 className="kicker mb-6 text-signal">Related Stories</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/news/${item.slug}`}
                  className="group block rounded-lg border border-line p-4 transition-colors hover:bg-soft"
                >
                  <h3 className="editorial text-xl font-bold text-ink group-hover:text-signal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </Container>
    </Section>
  );
}