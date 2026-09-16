import { getTranslations } from "next-intl/server";
import { cmsApi } from "@/shared/api/cms";
import type { Article } from "@/types/news";
import type { Locale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import { WebPageSchema } from "@/components/seo/webpage-schema";

// Note: Consider moving these legacy components to FSD widgets/entities
import { Container, Section } from "@/components/layout/layout";
import { HorizontalCard } from "@/components/cards/card-system";

const description = "Verified, independent fact-checking from DailySamachar, with evidence, context and clear explanations of what is known.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations("seo.factCheck");
  return getStaticPageMetadata({
    locale,
    path: "/fact-check",
    title: t("title") || "Fact Check | DailySamachar",
    description: t("description") || description,
  });
}

export default async function FactCheckPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations("factCheck");

  // FIXED: Added explicit type to satisfy TypeScript strict mode
  let factCheckArticles: Article[] = [];

  try {
    factCheckArticles = await cmsApi.getArticlesByCategory("fact-check", 1, 12);
    if (factCheckArticles.length === 0) {
      factCheckArticles = await cmsApi.getArticlesByTag("fact-check", 1, 12);
    }
  } catch {
    // Graceful degradation on failure
    factCheckArticles = [];
  }

  return (
    <Container className="py-8">
      <Section>
        <WebPageSchema locale={locale} path="/fact-check" title={t("heading") || "Fact Check | DailySamachar"} description={description} />
        {/* Page Header */}
        <div className="border-line mb-8 border-b pb-4">
          <h1 className="editorial text-ink text-4xl font-black md:text-5xl">{t("heading") || "Fact Check"}</h1>
          <p className="text-muted mt-4 max-w-2xl text-lg">
            {t("subheading") ||
              "We examine claims that travel quickly and explain the evidence that matters. Verified and independent fact-checking."}
          </p>
          <div className="text-muted mt-6 grid gap-4 text-sm leading-6 md:grid-cols-3" aria-label="Fact-checking standards">
            <p><strong className="text-ink">Claim:</strong> We identify the exact statement and its source.</p>
            <p><strong className="text-ink">Evidence:</strong> We check primary records and credible reporting.</p>
            <p><strong className="text-ink">Verdict:</strong> We explain what the evidence supports and what remains uncertain.</p>
          </div>
        </div>

        {/* Empty State Handling */}
        {factCheckArticles.length === 0 ? (
          // FIXED: Replaced arbitrary min-h-[300px] with canonical min-h-75
          <div className="border-line bg-soft flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-ink text-lg font-medium">{t("emptyStateTitle") || "No articles found"}</p>
            <p className="text-muted mt-2 text-sm">
              {t("emptyStateDesc") || "Please check back later for new fact checks."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {factCheckArticles.map((article) => (
              <HorizontalCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}
