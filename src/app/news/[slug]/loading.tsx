import { Container, Section } from "@/components/layout/layout";

export default function ArticleLoading() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <div 
          className="animate-pulse space-y-6"
          aria-busy="true" 
          aria-live="polite"
          aria-label="Loading article..."
        >
          {/* Kicker & Title */}
          <div className="h-4 w-24 rounded bg-signal/50"></div>
          <div className="space-y-3">
            <div className="h-10 w-full rounded bg-line/50"></div>
            <div className="h-10 w-4/5 rounded bg-line/50"></div>
          </div>
          
          {/* Author & Date */}
          <div className="flex items-center gap-3 pt-4">
            <div className="h-10 w-10 rounded-full bg-line/50"></div>
            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-line/50"></div>
              <div className="h-3 w-24 rounded bg-line/50"></div>
            </div>
          </div>

          {/* Hero Image - FIXED: Changed h-[400px] to h-100 */}
          <div className="h-100 w-full rounded-xl bg-line/40 my-8"></div>

          {/* Prose Content Skeleton */}
          <div className="space-y-4 pt-4">
            <div className="h-4 w-full rounded bg-line/50"></div>
            <div className="h-4 w-full rounded bg-line/50"></div>
            <div className="h-4 w-5/6 rounded bg-line/50"></div>
            <div className="h-4 w-full rounded bg-line/50"></div>
            <div className="h-4 w-4/5 rounded bg-line/50"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
}