import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

const description = "The DailySamachar editorial policy explains our standards for accuracy, fairness, independence, sources and opinion.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/editorial-policy", title: "Editorial Policy | DailySamachar", description });
}

export default async function EditorialPolicy({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/editorial-policy" description={description} eyebrow="Our standards" title="Editorial policy.">
      <p>
        Our reporting is independent of advertisers, political parties and commercial interests. Stories are reviewed
        for accuracy, context, fairness and clarity before publication.
      </p>
      <p>
        Opinion is clearly labelled. Sources are protected when necessary and anonymous sourcing is used only when the
        public interest outweighs the limitation.
      </p>
      <section aria-labelledby="editorial-process">
        <h2 id="editorial-process" className="editorial text-2xl font-bold">Our reporting process</h2>
        <p>We seek primary documents and on-record sources where possible, separate fact from allegation, provide relevant context and update stories when verified facts change.</p>
      </section>
    </StaticPage>
  );
}
