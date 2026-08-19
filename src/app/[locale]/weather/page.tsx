import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createWeatherRepository } from "@/services/weather";
import { WeatherPanel } from "@/features/weather/ui/weather-panel";
import { Container, Section } from "@/components/layout/layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations("weather");
  const { locale } = await params;
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/weather`, languages: { hi: "/hi/weather", en: "/en/weather" } },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function WeatherPage() {
  const t = await getTranslations("weather");
  const common = await getTranslations("common");
  let weather;
  try {
    weather = await createWeatherRepository().getByCity("New Delhi");
  } catch {
    weather = undefined;
  }
  return (
    <main>
      <Section>
        <Container>
          <div className="mb-10">
            <p className="kicker">{common("brand")}</p>
            <h1 className="editorial mt-3 text-5xl font-bold">{t("title")}</h1>
            <p className="text-muted mt-3 max-w-2xl">{t("description")}</p>
          </div>
          <WeatherPanel initialData={weather} />
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
