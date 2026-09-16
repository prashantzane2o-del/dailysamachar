import { StaticPage } from "@/features/home/components/static-page";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

const description = "Learn about DailySamachar, our independent newsroom, editorial standards and commitment to accurate public-interest journalism.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/about", title: "About DailySamachar | Independent Newsroom", description });
}

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/about" description={description} eyebrow="About DailySamachar" title="Journalism that respects your time.">
      <p>
        DailySamachar is an independent newsroom for India and the world. We report with care, explain with context, and
        correct our work transparently.
      </p>
      <p>
        Our work is built around a simple principle: the public deserves clear information, especially when events move
        quickly.
      </p>
      <section aria-labelledby="about-values">
        <h2 id="about-values" className="editorial text-2xl font-bold">What guides our newsroom</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Accuracy and context come before speed.</li>
          <li>News, analysis and opinion are clearly distinguished.</li>
          <li>We disclose and correct meaningful errors.</li>
          <li>Advertising does not control editorial decisions.</li>
        </ul>
      </section>
      <p>
        Read our <Link className="text-signal underline underline-offset-4" href="/editorial-policy">editorial policy</Link> or
        contact the newsroom at <a className="text-signal underline underline-offset-4" href="mailto:news@dailysamachar.org">news@dailysamachar.org</a>.
      </p>
    </StaticPage>
  );
}
