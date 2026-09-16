// src/entities/article/ui/article-card.tsx
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsExcerpt, stripCmsHtml } from "@/shared/lib/cms-html";

export interface ArticleCardProps {
  article: Article;
  isHindi?: boolean;
}

export function ArticleCard({ article, isHindi = true }: ArticleCardProps) {
  const displayTitle = article?.title || "Untitled";

  // FIXED: Removed raw HTML tags like <p> using stripCmsHtml
  const displayExcerpt = stripCmsExcerpt(article?.excerpt || "");

  const displayImageUrl = article?.image || article?.imageUrl || "";
  const displayCategory = article?.category || "News";
  const displayPublishedAt = article?.publishedAt || "";
  const displayHref = article?.slug ? `/news/${article.slug}` : "#";

  const safeIdStr = displayTitle.replace(/\s+/g, "-").slice(0, 20);

  let formattedDate = "Recently";
  if (displayPublishedAt) {
    const dateObj = new Date(displayPublishedAt);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  const titleFontClass = isHindi ? "font-devanagari tracking-normal" : "font-roboto tracking-tight";
  const textDir = isHindi ? "ltr" : "auto";

  return (
    <article
      className="group bg-paper border-line flex flex-col overflow-hidden rounded-md border shadow-sm transition-shadow duration-300 hover:shadow-md"
      aria-labelledby={`article-title-${safeIdStr}`}
      dir={textDir}
    >
      <Link
        href={displayHref}
        className="focus-visible:ring-signal flex grow flex-col outline-none focus-visible:ring-4 focus-visible:ring-offset-2"
      >
        <div className="bg-soft relative aspect-video w-full overflow-hidden">
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt={`Cover image for ${stripCmsHtml(displayTitle)}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted bg-soft absolute inset-0 flex items-center justify-center font-medium">
              No Image
            </div>
          )}

          <div className="absolute top-0 left-0 z-10 m-3">
            <span className="bg-signal rounded-sm px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-sm">
              {displayCategory}
            </span>
          </div>
        </div>

        <div className="flex grow flex-col p-4 sm:p-5">
          <time
            dateTime={displayPublishedAt || new Date().toISOString()}
            className="text-muted mb-2 text-xs font-medium tracking-wide uppercase"
          >
            {formattedDate}
          </time>

          <h2
            id={`article-title-${safeIdStr}`}
            className={`text-ink group-hover:text-signal mb-3 line-clamp-3 text-lg leading-snug font-bold transition-colors sm:text-xl ${titleFontClass}`}
          >
            {/* FIXED: Ensure entities like &#8217; render correctly */}
            <SanitizedHtml as="span" html={displayTitle} />
          </h2>

          {displayExcerpt && (
            <p className={`text-muted mt-auto line-clamp-2 text-sm ${titleFontClass}`}>{displayExcerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
