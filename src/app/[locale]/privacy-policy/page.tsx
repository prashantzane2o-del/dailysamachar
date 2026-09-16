import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

const description = "Read how DailySamachar handles personal information, cookies, analytics and reader privacy.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/privacy-policy", title: "Privacy Policy | DailySamachar", description });
}

export default async function Privacy({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/privacy-policy" description={description} eyebrow="Legal" title="Privacy policy.">
      <p>
        We collect only the information needed to operate DailySamachar, deliver newsletters you request and understand
        how readers use our product.
      </p>
      <p>
        We do not sell personal information. You may request access, correction or deletion of your information by
        contacting our newsroom at <a className="text-signal underline underline-offset-4" href="mailto:news@dailysamachar.org">news@dailysamachar.org</a>.
      </p>
      <p>We use reasonable safeguards and retain information only as long as needed for the purpose for which it was collected or as required by law. This policy may be updated when our services change.</p>
    </StaticPage>
  );
}
