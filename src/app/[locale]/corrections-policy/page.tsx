import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

const description = "Learn how DailySamachar receives, reviews and publishes corrections to its reporting.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/corrections-policy", title: "Corrections Policy | DailySamachar", description });
}

export default async function CorrectionsPolicy({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/corrections-policy" description={description} eyebrow="Accountability" title="Corrections policy.">
      <p>
        When we make a factual error, we correct it promptly and clearly. Material changes are noted in the article with
        an explanation of what changed.
      </p>
      <p>
        To report a potential error, contact {" "}
        <a className="text-signal underline underline-offset-4" href="mailto:news@dailysamachar.org">
          news@dailysamachar.org
        </a>{" "}
        with the article URL and supporting
        information.
      </p>
      <p>Please include the article URL, the specific claim in question, reliable supporting evidence and your preferred way to be contacted. We review every substantive report and make changes transparently.</p>
    </StaticPage>
  );
}
