// src/widgets/site-header/ui/site-header.tsx
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { TopUtilityBar } from "./top-utility-bar";
import { MainNavigation } from "./main-navigation";
import { SearchTrigger } from "./search-trigger";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";
import { cmsApi } from "@/shared/api/cms";
import { getTranslations } from "next-intl/server";
import { stripCmsHtml } from "@/shared/ui/sanitized-html";
import { Calculator } from "lucide-react";

export async function SiteHeader() {
  const tNav = await getTranslations("navigation");

  let topCategories: Array<{ title: string; href: string }> = [];
  let moreCategories: Array<{ title: string; href: string }> = [];

  try {
    const categories = await cmsApi.getCategories();

    if (categories && Array.isArray(categories)) {
      const validCategories = categories
        .filter((cat) => cat.slug && cat.slug.toLowerCase() !== "uncategorized")
        .map((cat) => ({
          title: stripCmsHtml(cat.name || cat.title),
          href: `/category/${cat.slug}`,
        }));

      // FIXED: Split categories into top items (visible) and more items (dropdown)
      topCategories = validCategories.slice(0, 5);
      moreCategories = validCategories.slice(5);
    }
  } catch (error) {
    console.error("Failed to fetch categories for header", error);
  }

  const fallbackCategories = [
    { title: tNav("india", { fallback: "India" }), href: "/category/india" },
    { title: tNav("world", { fallback: "World" }), href: "/category/world" },
    { title: tNav("sports", { fallback: "Sports" }), href: "/category/sports" },
  ];

  // If API fails or returns no categories, use fallbacks
  if (topCategories.length === 0) {
    topCategories = fallbackCategories;
  }

  // FIXED: Core links structured correctly with top categories in the middle
  const finalNavigationLinks = [
    { title: tNav("home", { fallback: "Home" }), href: "/" },
    ...topCategories,
    { title: tNav("opinion", { fallback: "Opinion" }), href: "/opinion" },
    { title: tNav("live", { fallback: "Live" }), href: "/live" },
  ];

  return (
    <header
      className="border-brand-accent sticky top-0 z-40 w-full border-b-4 bg-white/95 text-slate-900 shadow-sm backdrop-blur transition-colors duration-300 supports-backdrop-filter:bg-white/80"
      aria-label="Main Site Header"
    >
      <TopUtilityBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between md:h-20">
          <div className="flex shrink-0 items-center gap-3 md:gap-6">
            <div className="block lg:hidden">
              {/* Passing both arrays to mobile menu */}
              <MobileMenuTrigger links={finalNavigationLinks} dropdownLinks={moreCategories} />
            </div>
            <div className="flex shrink-0 items-center">
              <BrandLogo />
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 justify-center overflow-hidden px-4 lg:flex">
            {/* Passing both arrays to desktop navigation */}
            <MainNavigation links={finalNavigationLinks} dropdownLinks={moreCategories} />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1 md:gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            <Link
              href="/tools"
              aria-label={tNav("tools", { fallback: "Tools & Calculators" })}
              className="hover:text-signal focus-visible:ring-signal flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </Link>

            <SearchTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}
