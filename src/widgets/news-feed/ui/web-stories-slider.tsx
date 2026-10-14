// src/widgets/news-feed/ui/web-stories-slider.tsx
import Image from "next/image";
import { cmsApi } from "@/shared/api/cms";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Zap, Image as ImageIcon } from "lucide-react";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsHtml } from "@/shared/lib/cms-html";

export interface WebStoriesSliderProps {
  locale: string;
} // ✅ FIXED: Missing closing bracket for interface

export async function WebStoriesSlider({ locale }: WebStoriesSliderProps) {
  void locale;

  // CMS API se Web Stories fetch karein (Max 8 stories)
  const stories = await cmsApi.getWebStories(8).catch((err) => {
    console.error("Web Stories component fetch failed:", err);
    return [];
  });

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

          {stories.length > 0 && (
            <Link
              href="/web-stories" // FIXED: Point to dedicated web-stories page
              className="group text-signal focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold tracking-wider uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-none"
              aria-label="View all Web Stories"
            >
              View All
              <ArrowRight
                className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        {/* Empty State / Fallback */}
        {!stories || stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-12 text-center">
            <ImageIcon className="text-muted mb-4 h-12 w-12 opacity-50" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">Visual Stories Coming Soon</h3>
            <p className="text-muted mt-2 max-w-sm text-sm">
              Our newsroom is preparing immersive web stories. Please check back later.
            </p>
          </div>
        ) : (
          /* 9:16 Portrait Slider */
          <div
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pt-2 pb-6 sm:gap-6"
            role="region"
            aria-roledescription="carousel"
            aria-label="Web Stories"
          >
            {stories.map((story, index) => {
              const posterUrl =
                story.poster_image_url ||
                story.story_poster?.url ||
                story._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "/Logo.png";
              const plainTitle = stripCmsHtml(story.title?.rendered) || "Untitled Story";
              const storyLink = story.link || `/web-stories`; // FIXED: Fallback link

              return (
                <a
                  key={story.id}
                  href={storyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-visible:ring-signal group relative aspect-9/16 w-37.5 shrink-0 snap-start overflow-hidden rounded-xl transition-shadow outline-none hover:shadow-xl focus-visible:ring-4 motion-reduce:transition-none sm:w-50 lg:w-60"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Web Story ${index + 1} of ${stories.length}: ${plainTitle}`}
                >
                  <Image
                    src={posterUrl}
                    alt={plainTitle}
                    fill
                    sizes="(max-width: 768px) 150px, 240px"
                    className="bg-black object-cover transition-transform duration-700 ease-out sm:group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="bg-signal absolute top-3 left-3 rounded-full p-1.5 shadow-sm">
                    <Zap className="h-3 w-3 text-white" fill="currentColor" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="line-clamp-4 font-sans text-sm leading-snug font-bold text-white md:text-base">
                      <SanitizedHtml as="span" html={story.title?.rendered} />
                    </h3>
                    <p className="mt-2 text-[10px] font-bold tracking-wider text-slate-300 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Read Story
                    </p>
                  </div>
                </a>
              );
            })}

            {/* View All Card at the end */}
            {stories.length >= 4 && (
              <div className="flex w-37.5 shrink-0 snap-start items-center justify-center sm:w-50 lg:w-60">
                <Link
                  href="/web-stories" // FIXED: Point to dedicated web-stories page
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
        )}
      </div>
    </section>
  );
} // ✅ FIXED: Missing closing bracket for function