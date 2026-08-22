import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Article } from "@/entities/article/model/types";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";

interface HeroStoryWidgetProps {
  article: Article;
}

export function HeroStoryWidget({ article }: HeroStoryWidgetProps) {
  const locale = useLocale();
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <article className="group mb-12 flex flex-col gap-6 md:flex-row md:items-center">
      {/* Large Featured Image (2/3 width on desktop) */}
      <Link 
        href={`/news/${article.slug}`} 
        className="relative block w-full overflow-hidden rounded-md bg-soft aspect-video md:w-2/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
        aria-hidden="true"
        tabIndex={-1}
      >
        {article.featuredImage ? (
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || "Featured story thumbnail"}
            fill
            priority // Critical for LCP (Largest Contentful Paint) SEO metric
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="font-medium uppercase tracking-widest text-lg">DailySamachar</span>
          </div>
        )}
      </Link>

      {/* Hero Content (1/3 width on desktop) */}
      <div className="flex w-full flex-col gap-4 md:w-1/3">
        <div>
          <Link 
            href={`/category/${article.category.slug}`}
            className="kicker inline-block text-xs text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
          >
            {article.category.name}
          </Link>
        </div>

        <h2 className="editorial text-3xl font-black leading-tight text-ink md:text-4xl lg:text-5xl group-hover:text-signal transition-colors">
          <Link 
            href={`/news/${article.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-sm"
          >
            <SanitizedHtml as="span" html={article.title || "Untitled story"} />
          </Link>
        </h2>

        <SanitizedHtml html={article.excerpt || ""} className="line-clamp-3 text-base text-muted prose-p:m-0" />

        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted">
          <span>{article.author.name}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-line"></span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}
