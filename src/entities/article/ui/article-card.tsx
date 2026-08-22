import Image from "next/image";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import { getLocalizedPath } from "@/i18n/path";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import type { Article as DomainArticle } from "@/entities/article/model/types";
import type { Article as NewsArticle } from "@/types/news";

interface ArticleCardProps {
  article: DomainArticle | NewsArticle;
  className?: string;
}

function isNewsArticle(article: DomainArticle | NewsArticle): article is NewsArticle {
  return typeof article.author === "string";
}

export function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const locale = useLocale();
  const newsArticle = isNewsArticle(article);
  const image = newsArticle ? article.image : article.featuredImage?.url;
  const imageAlt = newsArticle ? article.imageAlt || article.title : article.featuredImage?.alt || article.title;
  const category = newsArticle
    ? { name: article.category, slug: article.category.toLowerCase().replaceAll(" ", "-") }
    : article.category;
  const author = newsArticle ? article.author : article.author?.name || "DailySamachar Desk";
  const storyPath = getLocalizedPath(locale, `/news/${article.slug}`);
  const categoryPath = getLocalizedPath(locale, `/category/${category.slug}`);
  const publishedAt = new Date(article.publishedAt);
  const formattedDate = Number.isNaN(publishedAt.getTime())
    ? article.publishedAt
    : new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(publishedAt);

  return (
    <article className={`group flex h-full flex-col gap-4 ${className}`}>
      <NextLink href={storyPath} className="relative block aspect-video overflow-hidden rounded-xl bg-soft focus-visible:ring-2 focus-visible:ring-focus" aria-label={article.title}>
        {image ? (
          <Image src={image} alt={imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted"><span className="text-sm font-medium uppercase tracking-widest">DailySamachar</span></div>
        )}
      </NextLink>

      <div className="flex grow flex-col gap-2">
        <NextLink href={categoryPath} className="kicker inline-block text-[11px] hover:underline focus-visible:ring-2 focus-visible:ring-focus">{category.name}</NextLink>
        <h2 className="editorial line-clamp-2 text-xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-signal dark:text-gray-100">
          <NextLink href={storyPath} className="rounded-sm focus-visible:ring-2 focus-visible:ring-focus">
            <SanitizedHtml as="span" html={article.title || "Untitled story"} />
          </NextLink>
        </h2>
        <SanitizedHtml html={article.excerpt || ""} className="line-clamp-3 text-sm leading-relaxed text-muted" />
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-medium text-muted">
          <span>{author}</span><span aria-hidden="true" className="h-1 w-1 rounded-full bg-line" /><time dateTime={article.publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}
