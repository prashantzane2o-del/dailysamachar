// src/widgets/news-feed/ui/hero-story-widget.tsx
"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { stripCmsHtml } from "@/shared/lib/cms-html";
import type { Article } from "@/types/news";

export interface HeroStoryWidgetProps {
  stories?: Article[];
  mainStory?: Article | null;
  sideStories?: Article[];
  sectionTitle?: string;
}

export function HeroStoryWidget({
  stories = [],
  mainStory,
  sideStories = [],
  sectionTitle = "Latest Headlines",
}: HeroStoryWidgetProps) {
  const headingId = useId();
  const headingLabel = sectionTitle.trim() || "Latest Headlines";
  const fallbackStories = [mainStory, ...(Array.isArray(sideStories) ? sideStories : [])];
  const visibleStories = (stories.length > 0 ? stories : fallbackStories)
    .filter((story): story is Article => Boolean(story?.id && story.slug))
    .slice(0, 5);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(visibleStories.length - 1, 0)));
  }, [visibleStories.length]);

  useEffect(() => {
    if (visibleStories.length < 2 || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleStories.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused, visibleStories.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + visibleStories.length) % visibleStories.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % visibleStories.length);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 44 || visibleStories.length < 2) return;
    setIsPaused(true);
    if (distance < 0) showNext();
    else showPrevious();
  };

  if (visibleStories.length === 0) return null;

  const activeStory = visibleStories[activeIndex] ?? visibleStories[0];

  return (
    <section
      className="w-full py-8 motion-reduce:py-6"
      aria-labelledby={headingId}
      aria-describedby={`${headingId}-description`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-line mb-6 flex items-center justify-between border-b-2 pb-2">
          <h2
            id={headingId}
            className="text-ink flex min-w-0 items-center gap-3 text-2xl font-bold tracking-wide uppercase"
          >
            <span className="bg-signal inline-block h-6 w-3 shrink-0" aria-hidden="true" />
            <span>{headingLabel}</span>
          </h2>
          <Link
            href="/latest"
            className="text-signal hover:text-ink focus-visible:ring-signal focus-visible:ring-offset-paper ml-4 min-h-11 shrink-0 rounded-sm px-2 py-2 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none"
            aria-label={`View all ${headingLabel.toLowerCase()} stories`}
          >
            <span aria-hidden="true">View all »</span>
          </Link>
        </div>
        <p id={`${headingId}-description`} className="sr-only">
          One featured story is shown at a time and changes automatically every six seconds. Use the controls to browse
          stories.
        </p>

        <div
          className="border-line bg-paper relative overflow-hidden rounded-2xl border shadow-xl"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${headingLabel} carousel`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
          }}
        >
          <div
            className="relative aspect-4/3 min-h-0 w-full touch-pan-y sm:aspect-16/8"
            role="group"
            aria-roledescription="slide"
            aria-label={`Story ${activeIndex + 1} of ${visibleStories.length}`}
            aria-live={isPaused ? "polite" : "off"}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
          >
            {activeStory.image ? (
              <Image
                src={activeStory.image}
                alt={activeStory.imageAlt || stripCmsHtml(activeStory.title)}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-800" aria-hidden="true" />
            )}
            <div
              className="pointer-events-none absolute inset-0 hidden bg-linear-to-t from-black via-black/35 to-black/5 sm:block"
              aria-hidden="true"
            />
          </div>

          <div className="bg-paper text-ink p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-black/70 sm:p-8 sm:pb-20 lg:p-10 lg:pb-20">
            <p className="text-signal mb-2 text-xs font-bold tracking-[0.2em] uppercase sm:text-white/80">
              {activeStory.category || "Latest News"}
            </p>
            <h3 className="text-ink max-w-4xl text-xl leading-tight font-black sm:text-3xl sm:text-white lg:text-5xl">
              {stripCmsHtml(activeStory.title)}
            </h3>
            <Link
              href={`/news/${activeStory.slug}`}
              className="focus-visible:ring-signal bg-signal hover:bg-brand-red-light focus-visible:ring-offset-paper sm:hover:bg-signal mt-4 inline-flex min-h-11 items-center rounded-md px-4 py-2 text-sm font-bold text-white transition-colors focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none sm:mt-5 sm:bg-white sm:text-slate-900 sm:hover:text-white sm:focus-visible:ring-offset-black"
            >
              Read story
            </Link>
          </div>

          {visibleStories.length > 1 && (
            <div className="border-line bg-paper flex items-center justify-between gap-4 border-t px-4 py-3 sm:absolute sm:right-8 sm:bottom-8 sm:left-8 sm:border-0 sm:bg-transparent sm:p-0">
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="focus-visible:ring-signal flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/70 bg-black/65 text-white outline-none hover:bg-black/90 focus-visible:ring-4"
                  aria-label="Show previous story"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="focus-visible:ring-signal flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/70 bg-black/65 text-white outline-none hover:bg-black/90 focus-visible:ring-4"
                  aria-label="Show next story"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose featured story">
                {visibleStories.map((story, index) => (
                  <button
                    key={story.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Show story ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`focus-visible:ring-signal focus-visible:ring-offset-paper h-3 min-h-3 w-3 min-w-3 rounded-full border border-slate-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none sm:border-white sm:focus-visible:ring-white sm:focus-visible:ring-offset-black ${
                      index === activeIndex
                        ? "bg-signal sm:bg-white"
                        : "hover:bg-signal/30 bg-transparent sm:hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsPaused((paused) => !paused)}
                className="focus-visible:ring-signal text-ink border-line bg-paper hover:bg-soft flex min-h-11 min-w-11 items-center justify-center rounded-full border outline-none focus-visible:ring-4 sm:border-white/70 sm:bg-black/65 sm:text-white sm:hover:bg-black/90"
                aria-label={isPaused ? "Play featured stories" : "Pause featured stories"}
              >
                {isPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
