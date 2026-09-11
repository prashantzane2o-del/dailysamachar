// src/widgets/site-footer/ui/site-footer.tsx

import { Link } from '@/i18n/navigation';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { MAIN_NAVIGATION, FOOTER_NAVIGATION } from '@/shared/config/navigation';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  // Filter main navigation to show only relevant categories in footer
  const topCategories = MAIN_NAVIGATION.filter(
    (nav) => nav.href.includes('/category') || nav.href === '/markets' || nav.href === '/opinion'
  );

  // Combine company and legal links
  const legalAndCompanyLinks = [...FOOTER_NAVIGATION.company, ...FOOTER_NAVIGATION.legal];

  return (
    <footer 
      className="bg-brand-primary text-gray-300 mt-auto border-t-4 border-brand-accent"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Site Footer</h2>
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="bg-white/95 inline-block px-3 py-2 rounded-md shadow-sm">
              <BrandLogo />
            </div>
            <p className="text-sm leading-relaxed font-devanagari text-gray-400">
              (DailySamachar.org) - स्वतंत्र और निष्पक्ष पत्रकारिता।
            </p>
          </div>

          {/* Column 2: Top Categories (Config Sync) */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-6 border-l-4 border-brand-accent pl-3">
              Top Categories
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {topCategories.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary rounded-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies (Config Sync) */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-6 border-l-4 border-brand-accent pl-3">
              Company & Legal
            </h3>
            <ul className="space-y-4 text-sm" role="list">
              {legalAndCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary rounded-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-6 border-l-4 border-brand-accent pl-3">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest news alerts directly in your inbox.
            </p>
            <form className="flex" aria-label="Newsletter signup">
              <input 
                type="email" 
                placeholder="Email address" 
                required
                aria-label="Email address for newsletter"
                className="w-full px-4 py-2 bg-brand-blue-light text-white border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent placeholder-gray-400"
              />
              <button 
                type="submit"
                className="bg-brand-accent hover:bg-brand-red-light text-white px-4 py-2 rounded-r-md font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar - FIXED: Replaced hardcoded bg-[#08111A] with scalable bg-black/30 */}
      <div className="border-t border-gray-800 bg-black/30">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Daily Samachar. All rights reserved.
          </p>
          
          {/* Added Social Links from config */}
          <div className="flex gap-4">
            {FOOTER_NAVIGATION.social.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target={social.isExternal ? "_blank" : undefined}
                rel={social.isExternal ? "noopener noreferrer" : undefined}
                className="text-gray-500 hover:text-white transition-colors text-sm"
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