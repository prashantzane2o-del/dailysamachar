// src/app/[locale]/web-stories/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsHtml } from "@/shared/lib/cms-html";
import { Zap } from "lucide-react";
import { getLocalizedPath } from "@/i18n/path";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Web Stories | DailySamachar",
    description: "Immersive visual stories, quick explainers, and latest updates from DailySamachar.",
    alternates: {
      canonical: getLocalizedPath(locale, "/web-stories"),
    }
  };
}

export default async function WebStoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Grid ke liye hum 24 stories fetch kar rahe hain
  const stories = await cmsApi.getWebStories(24).catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Section className="pt-8 pb-16 md:pt-12">
        <Container>
          <header className="mb-10 border-b border-slate-800 pb-6">
            <p className="kicker text-signal mb-2">Visual Stories</p>
            <h1 className="editorial text-4xl font-bold tracking-tight sm:text-5xl">
              Web Stories
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">
              Tap and swipe through our latest visual stories, explainers, and quick updates directly from your screen.
            </p>
          </header>

          {stories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-16 text-center text-slate-400">
              <p className="text-lg font-semibold">Visual Stories Coming Soon</p>
              <p className="mt-2 text-sm">Our newsroom is preparing immersive web stories. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
              {stories.map((story, index) => {
                const posterUrl =
                  story.poster_image_url ||
                  story.story_poster?.url ||
                  story._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                  "/Logo.png";

                const plainTitle = stripCmsHtml(story.title?.rendered) || "Untitled Story";
                // Agar story ki link nahi hai toh fallback page par hi rakhein
                const storyLink = story.link || `/web-stories`;

                return (
                  <a
                    key={story.id}
                    href={storyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:ring-signal group relative flex aspect-9/16 w-full flex-col justify-end overflow-hidden rounded-xl bg-slate-900 shadow-sm transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-4"
                    aria-label={`Web Story: ${plainTitle}`}
                  >
                    <Image
                      src={posterUrl}
                      alt={plainTitle}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />
                    
                    <div className="absolute left-3 top-3 rounded-full bg-signal p-1.5 shadow-sm">
                      <Zap className="h-3 w-3 text-white" fill="currentColor" aria-hidden="true" />
                    </div>
                    
                    <div className="relative z-10 w-full p-4">
                      <h3 className="line-clamp-4 font-sans text-sm font-bold leading-snug text-white md:text-base">
                        <SanitizedHtml as="span" html={story.title?.rendered} />
                      </h3>
                      <p className="mt-2 text-[10px] font-bold tracking-wider text-slate-300 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Read Story
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}