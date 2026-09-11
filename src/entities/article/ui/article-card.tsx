// src/entities/article/ui/article-card.tsx

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Article } from '@/types/news';

export interface ArticleCardProps {
  // FIXED: Added 'article' prop to support <ArticleCard article={article} /> usages
  article?: Article; 
  id?: string;
  title?: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  publishedAt?: string;
  href?: string;
  isHindi?: boolean;
}

export function ArticleCard({
  article,
  title = '',
  excerpt = '',
  imageUrl = '',
  category = 'News',
  publishedAt = '',
  href = '#',
  isHindi = true,
}: ArticleCardProps) {
  // 1. Data Extraction: Use 'article' object if provided, otherwise fallback to individual props
  const displayTitle = article?.title || title || ' ';
  const displayExcerpt = article?.excerpt || excerpt || '';
  const displayImageUrl = article?.image || article?.imageUrl || imageUrl || '';
  const displayCategory = article?.category || category || 'News';
  const displayPublishedAt = article?.publishedAt || publishedAt || '';
  const displayHref = article?.slug ? `/news/${article.slug}` : href;

  // Safe ID string for accessibility IDs
  const safeIdStr = displayTitle.replace(/\s+/g, '-').slice(0, 20);

  // 2. Safe Date Handling
  let formattedDate = 'Recently';
  if (displayPublishedAt) {
    const dateObj = new Date(displayPublishedAt);
    if (!isNaN(dateObj.getTime())) { // Check if date is valid
      formattedDate = dateObj.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  // 3. Choose the font dynamically based on the language
  const titleFontClass = isHindi ? 'font-devanagari tracking-normal' : 'font-roboto tracking-tight';
  const textDir = isHindi ? 'ltr' : 'auto';

  return (
    <article 
      className="group flex flex-col bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      aria-labelledby={`article-title-${safeIdStr}`}
      dir={textDir}
    >
      <Link 
        href={displayHref}
        className="flex flex-col grow outline-none focus-visible:ring-4 focus-visible:ring-brand-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-brand-primary"
      >
        {/* Image Container */}
        <div className="relative w-full pt-[56.25%] overflow-hidden bg-gray-200 dark:bg-gray-800">
          {/* Safe Image Rendering: Only render Next Image if URL exists */}
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt={`Cover image for ${displayTitle}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
             /* Fallback UI if image is missing */
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
              No Image
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-0 left-0 m-3 z-10">
            <span className="bg-brand-accent text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
              {displayCategory}
            </span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="flex flex-col grow p-4 sm:p-5">
          {/* Metadata */}
          <time 
            dateTime={displayPublishedAt || new Date().toISOString()}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide"
          >
            {formattedDate}
          </time>

          {/* Headline */}
          <h2 
            id={`article-title-${safeIdStr}`}
            className={`text-lg sm:text-xl font-bold leading-snug mb-3 text-brand-primary dark:text-gray-100 group-hover:text-brand-accent transition-colors line-clamp-3 ${titleFontClass}`}
          >
            {displayTitle}
          </h2>

          {/* Excerpt */}
          {displayExcerpt && (
            <p className={`text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-auto ${titleFontClass}`}>
              {displayExcerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}