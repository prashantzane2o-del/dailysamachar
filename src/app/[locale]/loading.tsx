import { Container, Section } from "@/components/layout/layout";

export default function Loading() {
  return (
    <Section>
      <Container>
        {/* AAA Standard: aria-busy aur aria-live for screen readers */}
        <div 
          className="animate-pulse space-y-8" 
          aria-busy="true" 
          aria-live="polite"
          aria-label="Loading content..."
        >
          {/* Header Skeleton */}
          <div className="h-12 w-3/4 rounded-lg bg-line/50 md:w-1/2"></div>
          
          {/* Grid Skeleton for Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 w-full rounded-xl bg-line/40"></div>
                <div className="h-4 w-1/4 rounded bg-line/50"></div>
                <div className="h-6 w-full rounded bg-line/50"></div>
                <div className="h-6 w-5/6 rounded bg-line/50"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}