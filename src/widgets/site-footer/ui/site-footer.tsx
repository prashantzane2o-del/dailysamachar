// src/widgets/site-footer/ui/site-footer.tsx

import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { MAIN_NAVIGATION, FOOTER_NAVIGATION } from "@/shared/config/navigation";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  // Filter main navigation to show only relevant categories in footer
  const topCategories = MAIN_NAVIGATION.filter(
    (nav) => nav.href.includes("/category") || nav.href === "/markets" || nav.href === "/opinion",
  );

  // Combine company and legal links
  const legalAndCompanyLinks = [...FOOTER_NAVIGATION.company, ...FOOTER_NAVIGATION.legal];

  return (
    <footer
      className="bg-brand-primary border-brand-accent mt-auto border-t-4 text-gray-300"
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
            <p className="font-devanagari text-sm leading-relaxed text-gray-400">
              (DailySamachar.org) - स्वतंत्र और निष्पक्ष पत्रकारिता।
            </p>
          </div>

          {/* Column 2: Top Categories (Config Sync) */}
          <div>
            <h3 className="border-brand-accent mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider text-white uppercase">
              Top Categories
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {topCategories.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-visible:ring-brand-accent focus-visible:ring-offset-brand-primary rounded-sm transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies (Config Sync) */}
          <div>
            <h3 className="border-brand-accent mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider text-white uppercase">
              Company & Legal
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {legalAndCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-visible:ring-brand-accent focus-visible:ring-offset-brand-primary rounded-sm transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="border-brand-accent mb-6 border-l-4 pl-3 text-lg font-bold tracking-wider text-white uppercase">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm text-gray-400">Get the latest news alerts directly in your inbox.</p>
            <form className="flex" aria-label="Newsletter signup">
              <input
                type="email"
                placeholder="Email address"
                required
                aria-label="Email address for newsletter"
                className="bg-brand-blue-light focus:ring-brand-accent w-full rounded-l-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-accent hover:bg-brand-red-light focus:ring-offset-brand-primary shrink-0 rounded-r-md px-4 py-2 font-bold text-white transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar - FIXED: Replaced hardcoded bg-[#08111A] with scalable bg-black/30 */}
      <div className="border-t border-gray-800 bg-black/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          <p className="text-sm text-gray-500">&copy; {currentYear} Daily Samachar. All rights reserved.</p>

          {/* Added Social Links from config */}
          <div className="flex gap-4">
            {FOOTER_NAVIGATION.social.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target={social.isExternal ? "_blank" : undefined}
                rel={social.isExternal ? "noopener noreferrer" : undefined}
                className="text-sm text-gray-500 transition-colors hover:text-white"
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
