// src/widgets/site-footer/ui/site-footer.tsx
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { FOOTER_NAVIGATION } from "@/shared/config/navigation";
import { cmsApi } from "@/shared/api/cms";
import { stripCmsHtml } from "@/shared/lib/cms-html";

export async function SiteFooter() {
  const currentYear = new Date().getFullYear();

  // Fetch dynamic categories from WordPress for the footer
  let topCategories: Array<{ title: string; href: string }> = [];
  try {
    const categories = await cmsApi.getCategories();
    if (categories && Array.isArray(categories)) {
      topCategories = categories
        .filter((cat) => cat.slug && !["uncategorized", "web-stories"].includes(cat.slug.toLowerCase()))
        .slice(0, 5) // Show top 5 categories
        .map((cat) => ({
          title: stripCmsHtml(cat.name || cat.title),
          href: `/category/${cat.slug}`,
        }));
    }
  } catch (error) {
    console.error("Failed to fetch categories for footer", error);
  }

  // Combine company and legal links
  const legalAndCompanyLinks = [...FOOTER_NAVIGATION.company, ...FOOTER_NAVIGATION.legal];

  return (
    <footer
      className="border-footer-accent bg-footer-background text-footer-foreground mt-auto border-t-4"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="inline-block rounded-md bg-white/95 px-3 py-2 shadow-sm">
              <BrandLogo />
            </div>
            <p className="text-footer-muted font-sans text-sm leading-relaxed">
              (DailySamachar.org) - Verified, independent news from India and around the world. We bring you the stories
              that shape our times.
            </p>
            <a className="text-footer-foreground text-sm font-semibold underline underline-offset-4" href="mailto:news@dailysamachar.org">
              news@dailysamachar.org
            </a>
          </div>

          {/* Column 2: Top Categories (Now 100% Dynamic) */}
          <div>
            <h3 className="border-footer-accent text-footer-foreground mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider uppercase">
              Top Categories
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {topCategories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-visible:ring-footer-accent focus-visible:ring-offset-footer-background text-footer-muted hover:text-footer-foreground rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div>
            <h3 className="border-footer-accent text-footer-foreground mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider uppercase">
              Company & Legal
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {legalAndCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-visible:ring-footer-accent focus-visible:ring-offset-footer-background text-footer-muted hover:text-footer-foreground rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="border-footer-accent text-footer-foreground mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider uppercase">
              Stay Updated
            </h3>
            <p className="text-footer-muted mb-4 text-sm">Get the latest news alerts directly in your inbox.</p>
            <form className="flex flex-col gap-2 sm:flex-row sm:gap-0" aria-label="Newsletter signup">
              <input
                type="email"
                placeholder="Email address"
                required
                aria-label="Email address for newsletter"
                className="bg-footer-field focus:ring-footer-accent placeholder:text-footer-muted border-footer-line text-footer-foreground w-full min-w-0 rounded-md border px-4 py-3 focus:border-transparent focus:ring-2 focus:outline-none sm:rounded-r-none"
              />
              <button
                type="submit"
                className="bg-footer-accent hover:bg-footer-accent-hover focus:ring-offset-footer-background min-h-11 shrink-0 rounded-md px-4 py-3 font-bold text-white transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none sm:rounded-l-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-footer-line border-t bg-black/25">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          <p className="text-footer-muted text-sm">&copy; {currentYear} Daily Samachar. All rights reserved.</p>
          <div className="flex gap-4">
            {FOOTER_NAVIGATION.social.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target={social.isExternal ? "_blank" : undefined}
                rel={social.isExternal ? "noopener noreferrer" : undefined}
                className="text-footer-muted hover:text-footer-foreground text-sm transition-colors"
                aria-label={social.title}
              >
                {social.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
