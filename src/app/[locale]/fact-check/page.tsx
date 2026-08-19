import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getFeaturedArticles } from "@/services/news";

// Note: Consider moving these legacy components to FSD widgets/entities
import { Container, Section } from "@/components/layout/layout";
import { HorizontalCard } from "@/components/cards/card-system";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.factCheck");
  
  return {
    title: t("title") || "Fact Check | DailySamachar",
    description: t("description") || "Verified and independent fact-checking.",
    alternates: {
      canonical: "/fact-check",
    },
    openGraph: {
      title: t("title") || "Fact Check | DailySamachar",
      description: t("description") || "Verified and independent fact-checking.",
      type: "website",
    },
  };
}

export default async function FactCheckPage() {
  const locale = await getLocale();
  const t = await getTranslations("factCheck");
  
  // FIXED: Added explicit type to satisfy TypeScript strict mode
  let factCheckArticles: any[] = [];
  
  try {
    factCheckArticles = await getFeaturedArticles(locale);
  } catch (error) {
    // Graceful degradation on failure
    factCheckArticles = [];
  }

  return (
    <Container className="py-8">
      <Section>
        {/* Page Header */}
        <div className="mb-8 border-b border-line pb-4">
          <h1 className="editorial text-4xl font-black text-ink md:text-5xl">
            {t("heading") || "Fact Check"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {t("subheading") || "We examine claims that travel quickly and explain the evidence that matters. Verified and independent fact-checking."}
          </p>
        </div>

        {/* Empty State Handling */}
        {factCheckArticles.length === 0 ? (
          // FIXED: Replaced arbitrary min-h-[300px] with canonical min-h-75
          <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-soft p-8 text-center">
            <p className="text-lg font-medium text-ink">
              {t("emptyStateTitle") || "No articles found"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {t("emptyStateDesc") || "Please check back later for new fact checks."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {factCheckArticles.map((article: any) => (
              <HorizontalCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}