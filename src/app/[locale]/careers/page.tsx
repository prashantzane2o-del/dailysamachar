import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

const description = "Explore newsroom, editorial, engineering and product opportunities at DailySamachar.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/careers", title: "Careers at DailySamachar", description });
}

export default async function Careers({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/careers" description={description} eyebrow="Work with us" title="Build a better news habit.">
      <p>
        We are looking for journalists, editors, engineers and product thinkers who care deeply about useful,
        independent public-interest journalism.
      </p>
      <p>
        Send a concise note and relevant work to {" "}
        <a className="text-signal underline underline-offset-4" href="mailto:news@dailysamachar.org">
          news@dailysamachar.org
        </a>
        .
      </p>
      <section aria-labelledby="careers-roles">
        <h2 id="careers-roles" className="editorial text-2xl font-bold">What we value</h2>
        <p>Strong reporting, source care, clear writing, curiosity, accessibility and a willingness to learn in public.</p>
      </section>
    </StaticPage>
  );
}
