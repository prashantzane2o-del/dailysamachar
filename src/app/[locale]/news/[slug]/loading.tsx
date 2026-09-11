import { Container, Section } from "@/components/layout/layout";

export default function ArticleLoading() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <div
          className="space-y-6 motion-safe:animate-pulse"
          aria-busy="true"
          aria-live="polite"
          role="status"
          aria-label="Loading article..."
        >
          {/* Kicker & Title */}
          <div className="bg-signal/50 h-4 w-24 rounded"></div>
          <div className="space-y-3">
            <div className="bg-line/50 h-10 w-full rounded"></div>
            <div className="bg-line/50 h-10 w-4/5 rounded"></div>
          </div>

          {/* Author & Date */}
          <div className="flex items-center gap-3 pt-4">
            <div className="bg-line/50 h-10 w-10 rounded-full"></div>
            <div className="space-y-2">
              <div className="bg-line/50 h-3 w-32 rounded"></div>
              <div className="bg-line/50 h-3 w-24 rounded"></div>
            </div>
          </div>

          {/* Hero image reserves the same aspect ratio as the article page. */}
          <div className="bg-line/40 my-8 aspect-video w-full rounded-xl"></div>

          {/* Prose Content Skeleton */}
          <div className="space-y-4 pt-4">
            <div className="bg-line/50 h-4 w-full rounded"></div>
            <div className="bg-line/50 h-4 w-full rounded"></div>
            <div className="bg-line/50 h-4 w-5/6 rounded"></div>
            <div className="bg-line/50 h-4 w-full rounded"></div>
            <div className="bg-line/50 h-4 w-4/5 rounded"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
