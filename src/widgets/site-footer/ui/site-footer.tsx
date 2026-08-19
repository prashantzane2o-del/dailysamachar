import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t-[6px] border-ink bg-soft pt-16 pb-8"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">{tFooter("footerHeading")}</h2>
      
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="editorial text-3xl font-black tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-sm"
              aria-label={tCommon("brand")}
            >
              {tCommon("brand")}.
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {tFooter("description")}
            </p>
            
            <div className="mt-6">
              <p className="text-sm font-bold text-ink">{tFooter("subscribePrompt")}</p>
              <form className="mt-2 flex max-w-sm items-center gap-2" action="#">
                <label htmlFor="email-address" className="sr-only">{tFooter("emailLabel")}</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={tFooter("emailPlaceholder")}
                  className="w-full rounded-md border border-line bg-paper px-4 py-2 text-sm text-ink placeholder:text-muted focus-visible:border-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                />
                <button
                  type="submit"
                  className="rounded-md bg-signal px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
                >
                  {tFooter("signUp")}
                </button>
              </form>
            </div>
          </div>

          {/* Links: Sections */}
          <div>
            <h3 className="kicker mb-4 text-ink">{tFooter("sectionsHeading")}</h3>
            <ul className="space-y-3 text-sm font-medium text-muted">
              <li><Link href="/category/india" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tCommon("india")}</Link></li>
              <li><Link href="/category/world" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tCommon("world")}</Link></li>
              <li><Link href="/category/business" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tCommon("business")}</Link></li>
              <li><Link href="/video" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tCommon("video")}</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h3 className="kicker mb-4 text-ink">{tFooter("companyHeading")}</h3>
            <ul className="space-y-3 text-sm font-medium text-muted">
              <li><Link href="/about" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("aboutUs")}</Link></li>
              <li><Link href="/careers" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("careers")}</Link></li>
              <li><Link href="/advertise" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("advertise")}</Link></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h3 className="kicker mb-4 text-ink">{tFooter("legalHeading")}</h3>
            <ul className="space-y-3 text-sm font-medium text-muted">
              <li><Link href="/terms" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("terms")}</Link></li>
              <li><Link href="/privacy" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("privacy")}</Link></li>
              <li><Link href="/fact-check" className="rounded-sm hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{tFooter("factCheck")}</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 flex flex-col items-center justify-between border-t border-line pt-8 md:flex-row">
          <p className="text-xs text-muted">
            &copy; {currentYear} {tCommon("brand")} Media. {tFooter("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}