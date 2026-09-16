// src/widgets/news-feed/ui/web-stories-slider.tsx
import Image from "next/image";
import { cmsApi } from "@/shared/api/cms";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Zap } from "lucide-react";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsHtml } from "@/shared/lib/cms-html";

export interface WebStoriesSliderProps {
  locale: string;
}

export async function WebStoriesSlider({ locale }: WebStoriesSliderProps) {
  void locale;
  // WordPress se 'web-stories' category fetch karein
  // Note: Ensure WP mein "web-stories" slug wali category exist karti ho
  const stories = await cmsApi.getArticlesByCategory("web-stories", 1, 8).catch(() => []);

  if (stories.length === 0) {
    return null; // Agar stories nahi hain, toh section automatically hide ho jayega
  }

  return (
    <section
      className="w-full bg-slate-950 py-10 text-white shadow-inner dark:border-y dark:border-slate-800 dark:bg-slate-900/40"
      aria-labelledby="web-stories-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-6 flex items-end justify-between border-b-2 border-slate-800 pb-3">
          <h2
            id="web-stories-heading"
            className="flex items-center gap-3 text-2xl font-black tracking-wide uppercase md:text-3xl"
          >
            <span className="bg-signal inline-block h-6 w-3" aria-hidden="true"></span>
            Web Stories
          </h2>
          <Link
            href="/category/web-stories"
            className="group text-signal focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold tracking-wider uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-none"
            aria-label="View all Web Stories"
          >
            View All
            <ArrowRight
              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* 9:16 Portrait Slider */}
        <div
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pt-2 pb-6 sm:gap-6"
          role="region"
          aria-roledescription="carousel"
          aria-label="Web Stories"
        >
          {stories.map((story, index) => (
            <Link
              key={story.id}
              href={`/news/${story.slug}`}
              className="focus-visible:ring-signal group relative aspect-9/16 w-37.5 shrink-0 snap-start overflow-hidden rounded-xl transition-shadow outline-none hover:shadow-xl focus-visible:ring-4 motion-reduce:transition-none sm:w-50 lg:w-60"
              role="group"
              aria-roledescription="slide"
              aria-label={`Web Story ${index + 1} of ${stories.length}: ${stripCmsHtml(story.title)}`}
            >
              {/* Portrait Image */}
              <Image
                src={story.image || "/Logo.svg"}
                alt={story.imageAlt || stripCmsHtml(story.title)}
                fill
                sizes="(max-width: 768px) 150px, 240px"
                className="bg-black object-contain transition-transform duration-700 ease-out sm:object-cover sm:group-hover:scale-105"
              />

              {/* Dark Gradient Overlay for Text Readability */}
              <div
                className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"
                aria-hidden="true"
              />

              {/* Floating Icon Indicator */}
              <div className="bg-signal absolute top-3 left-3 rounded-full p-1.5 shadow-sm">
                <Zap className="h-3 w-3 text-white" fill="currentColor" aria-hidden="true" />
              </div>

              {/* Story Title */}
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="line-clamp-4 font-sans text-sm leading-snug font-bold text-white md:text-base">
                  <SanitizedHtml as="span" html={story.title} />
                </h3>
                <p className="mt-2 text-[10px] font-bold tracking-wider text-slate-300 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Read Story
                </p>
              </div>
            </Link>
          ))}

          {/* View All Card at the end */}
          {stories.length >= 4 && (
            <div className="flex w-37.5 shrink-0 snap-start items-center justify-center sm:w-50 lg:w-60">
              <Link
                href="/category/web-stories"
                className="group hover:text-signal flex flex-col items-center justify-center gap-3 text-slate-400 transition-colors"
              >
                <span className="border-line group-hover:border-signal flex h-14 w-14 items-center justify-center rounded-full border bg-slate-900 transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold tracking-wider uppercase">View All</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
