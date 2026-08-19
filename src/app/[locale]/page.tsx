import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

// Layout Primitives
import { Section, Container, SidebarLayout } from "@/components/layout/layout";

// Services (Data Fetching)
import { getFeaturedArticles, getRelatedArticles } from "@/services/news";

// Widgets & Features
import { WeatherUtilityBar as WeatherWidget } from "@/widgets/weather/weather-utility-bar";
import { MarketTicker as StockWidget } from "@/widgets/market-ticker/ui/market-ticker";
import { AdSlot } from "@/widgets/ads/ad-slot";
import { BmiCalculator } from "@/features/calculators/ui/bmi-calculator";
import { SipCalculator } from "@/features/calculators/ui/sip-calculator";

// 1. SEO Metadata Generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      template: `%s | ${t("siteName")}`,
      default: `${t("siteName")} - ${t("homeTitle")}`,
    },
    description: t("homeDescription"),
  };
}

// 2. Server Component for the Home Page
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  // Fetching data in parallel for better performance
  const [featuredArticles, latestArticles] = await Promise.all([
    getFeaturedArticles(locale),
    getRelatedArticles(locale, "home"), // Using this as a mock for "Latest News"
  ]);

  return (
    <main>
      {/* Top Stories Section */}
      <Section>
        <Container>
          <div className="mb-8 border-b border-line pb-4">
            <h1 className="editorial text-4xl font-black text-ink md:text-5xl">
              Top Stories
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-line bg-paper p-5 transition-colors hover:bg-soft focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2"
              >
                {article.category && (
                  <span className="kicker text-signal">{article.category}</span>
                )}
                <h2 className="editorial text-2xl font-bold leading-snug text-ink group-hover:text-signal">
                  {article.title}
                </h2>
                <p className="text-sm text-muted line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-4 text-xs font-semibold text-muted">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(article.publishedAt))}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Main Content with Sidebar Layout */}
      <Section className="border-y border-line bg-soft">
        <Container>
          <SidebarLayout
            sidebar={
              <div className="space-y-6">
                {/* Utility Widgets */}
                <WeatherWidget locale={locale as any} />
                <StockWidget />
                
                {/* Advertisement Component */}
                <AdSlot placement="sidebar" />

                {/* Calculators */}
                <SipCalculator />
                <BmiCalculator />
              </div>
            }
          >
            {/* Latest News Feed */}
            <div className="rounded-xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="kicker mb-6 border-b border-line pb-3 text-signal">
                Latest News
              </h2>
              <div className="flex flex-col gap-6 divide-y divide-line">
                {latestArticles.map((article) => (
                  <article key={article.id} className="pt-6 first:pt-0">
                    <Link
                      href={`/news/${article.slug}`}
                      className="group grid gap-4 md:grid-cols-12 focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-4"
                    >
                      <div className="md:col-span-8">
                        <h3 className="editorial text-xl font-bold text-ink group-hover:text-signal">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted">
                          <span>{article.author || t("brand")}</span>
                          <span>&bull;</span>
                          <time dateTime={article.publishedAt}>
                            {new Intl.DateTimeFormat(locale, {
                              dateStyle: "medium",
                            }).format(new Date(article.publishedAt))}
                          </time>
                        </div>
                      </div>
                      
                      {/* Image Placeholder with next/image */}
                      <div className="relative hidden h-28 w-full rounded-lg bg-soft md:col-span-4 md:block overflow-hidden border border-line">
                        {article.image && (
                          <Image 
                            src={article.image} 
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </SidebarLayout>
        </Container>
      </Section>
    </main>
  );
}
