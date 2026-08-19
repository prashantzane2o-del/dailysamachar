import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news"; // Assume ye FSD type humne banaya hai

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col space-y-3">
      {/* AAA Focus Management & Semantic HTML */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-soft">
        <Image
          src={article.image}
          // MUST: Descriptive alt text for screen readers (Rules compliance)
          alt={article.imageAlt || `Image for article: ${article.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="image-zoom object-cover transition-transform duration-700 ease-out"
          priority={false} // Lazy load by default
        />
      </div>
      
      <div className="flex flex-col">
        <span className="kicker mb-2 text-signal">{article.category}</span>
        <h3 className="editorial text-xl font-bold leading-tight text-ink">
          {/* Link that covers the whole card semantically */}
          <Link 
            href={`/news/${article.slug}`} 
            className="focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 rounded-sm outline-none"
          >
            <span className="absolute inset-0" aria-hidden="true"></span>
            {article.title}
          </Link>
        </h3>
        
        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-muted">
          <span>{article.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={article.publishedAtIso}>{article.publishedAt}</time>
        </div>
      </div>
    </article>
  );
}