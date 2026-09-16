import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

// 1. ADDED: SEO Metadata for static policy pages (Architecture SEO Standards)
const description = "Partner with DailySamachar through clear, respectful advertising opportunities for brands that value quality journalism.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/advertise", title: "Advertise With DailySamachar", description });
}

export default async function AdvertisePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/advertise" description={description} eyebrow="Partnerships" title="Advertising with integrity.">
      {/* 2. Added proper semantic prose classes for accessibility and readability */}
      <div className="prose prose-slate text-muted max-w-none" aria-label="Advertising information">
        <p className="text-lg leading-relaxed">
          We create clear, respectful advertising opportunities for brands that value quality journalism and attentive
          audiences. Editorial and advertising operations remain strictly separate.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          For our media kit and partnership inquiries, please contact{" "}
          <a
            href="mailto:news@dailysamachar.org"
            className="text-signal decoration-signal/30 hover:decoration-signal focus:ring-signal rounded-sm font-semibold underline underline-offset-4 transition focus:ring-2 focus:outline-none"
          >
            news@dailysamachar.org
          </a>
          .
        </p>
        <h2 className="mt-8 text-2xl font-bold text-ink">A clear separation from editorial</h2>
        <p className="mt-4 text-lg leading-relaxed">Sponsored placements are identified clearly. Advertisers cannot buy coverage, influence headlines or determine our reporting priorities.</p>
      </div>
    </StaticPage>
  );
}
