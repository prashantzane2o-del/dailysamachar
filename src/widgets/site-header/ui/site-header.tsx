import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { TopUtilityBar } from "./top-utility-bar";

// Client Island Components
import { MainNavigation } from "./main-navigation";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { SearchTrigger } from "./search-trigger";

export function SiteHeader() {
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/95 backdrop-blur-md transition-colors duration-300">
      {/* FIXED: Replaced focus:z-[100] with focus:z-100 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-sm focus:bg-signal focus:px-4 focus:py-2 focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2"
      >
        {tHeader("skipToContent") || "Skip to main content"}
      </a>

      {/* Unified Top Utility Bar */}
      <TopUtilityBar />

      {/* Main Branding and Actions */}
      <div className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-2 md:w-1/3 md:gap-4">
            <MobileMenuTrigger />
            <SearchTrigger />
          </div>

          {/* Center: AAA Accessible Typographic Logo */}
          <div className="flex justify-center md:w-1/3">
            <Link
              href="/"
              className="group flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4"
              aria-label={tCommon("brand")}
            >
              <span className="editorial text-3xl font-black tracking-tight text-ink md:text-4xl">
                {tCommon("brand")}<span className="text-signal transition-colors group-hover:text-ink">.</span>
              </span>
            </Link>
          </div>

          {/* Right: Tools & User Actions */}
          <div className="flex items-center justify-end gap-3 md:w-1/3 md:gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="hidden h-6 w-px bg-line md:block" aria-hidden="true" />
            
            <Link
              href="/login"
              className="hidden rounded-sm text-sm font-bold text-ink transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 lg:block"
            >
              {tHeader("signIn") || "Sign In"}
            </Link>
            <Link
              href="/subscribe"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-paper transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 md:block"
            >
              {tHeader("subscribe") || "Subscribe"}
            </Link>
          </div>
        </div>
      </div>

      {/* Extracted: Desktop Navigation */}
      <MainNavigation />
    </header>
  );
}