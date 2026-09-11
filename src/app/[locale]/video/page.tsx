import type { Metadata } from "next";
import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { VideoCard } from "@/components/cards/card-system";
import { Tabs } from "@/components/ui/feedback";

// 1. ADDED: SEO Metadata for the indexable route
export const metadata: Metadata = {
  title: "Video News & Explainers | DailySamachar",
  description: "Watch the latest news videos, explainers, and on-ground reports from India and around the world.",
  alternates: {
    canonical: "/video",
  },
  openGraph: {
    title: "Video News & Explainers | DailySamachar",
    description: "Watch the latest news videos, explainers, and on-ground reports.",
    type: "website",
  },
};

export default async function VideoPage() {
  // 2. FIXED: Fetching via Service Layer instead of direct array import
  // (Passing "en" as a fallback locale for now)
  const videos = await cmsApi.getFeaturedArticles();

  return (
    <Section>
      <Container>
        <div className="mb-10">
          <p className="kicker text-signal">Daily visual</p>
          <h1 className="editorial text-ink mt-2 text-5xl font-bold">Video</h1>
          <p className="text-muted mt-3 max-w-2xl">
            Dive deeper into the stories that matter with our exclusive explainers and on-ground visual reporting.
          </p>
        </div>

        <Tabs tabs={["Featured", "Explainers", "India", "World", "Culture"]} />

        {/* 3. ADDED: Semantic ARIA roles for list accessibility */}
        <div className="mt-8 grid gap-7 md:grid-cols-3" role="list" aria-label="Latest video reports">
          {videos.slice(0, 6).map((article) => (
            <div role="listitem" key={article.id}>
              <VideoCard article={article} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
