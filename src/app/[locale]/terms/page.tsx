import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

// 1. ADDED: SEO Metadata for static policy pages (Architecture SEO Standards)
const description = "Terms of use, copyright information and service expectations for DailySamachar readers.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/terms", title: "Terms of Use | DailySamachar", description });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/terms" description={description} eyebrow="Legal" title="Terms of use.">
      {/* 2. Added proper text styles and semantic spacing for readability */}
      <div className="prose prose-slate text-muted max-w-none" aria-label="Terms and conditions">
        <p className="text-lg leading-relaxed">
          DailySamachar content is protected by applicable copyright law. You may link to and share our reporting, but
          reproduction requires written permission except where law allows otherwise.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          We work to keep the service available and accurate, while acknowledging that reporting evolves as new facts
          are established.
        </p>
      </div>
    </StaticPage>
  );
}
