import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createMarketRepository } from "@/services/markets";
import { MarketDashboard } from "@/features/markets/ui/market-dashboard";
import { Container, Section } from "@/components/layout/layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations("markets");
  const { locale } = await params;
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/markets`, languages: { hi: "/hi/markets", en: "/en/markets" } },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function MarketsPage() {
  const common = await getTranslations("common");
  let markets;
  try {
    markets = await createMarketRepository().listQuotes();
  } catch {
    markets = undefined;
  }
  const t = await getTranslations("markets");
  return (
    <main>
      <Section>
        <Container>
          <div className="mb-10">
            <p className="kicker">{common("brand")}</p>
            <h1 className="editorial mt-3 text-5xl font-bold">{t("title")}</h1>
            <p className="text-muted mt-3 max-w-2xl">{t("description")}</p>
          </div>
          <MarketDashboard initialData={markets} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Dataset",
                name: t("title"),
                description: t("description"),
              }),
            }}
          />
        </Container>
      </Section>
    </main>
  );
}
