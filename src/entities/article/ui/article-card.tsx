import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Article } from "@/types/news";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Using explicit dimensions for the image or the fill approach per Next.js 15 best practices.
  // We'll use the 'fill' approach with a relative container for responsive design.
  const imageUrl = article.image;

  return (
    <Link 
      href={`/news/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {article.category && (
          <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {article.category}
          </span>
        )}
        
        <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-blue-600 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
          {article.excerpt || article.summary || ""}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-500">
          <span className="truncate pr-2">
            {article.author || "Editorial Desk"}
          </span>
          <time dateTime={article.publishedAt} className="shrink-0">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }).format(new Date(article.publishedAt))}
          </time>
        </div>
      </div>
    </Link>
  );
}
