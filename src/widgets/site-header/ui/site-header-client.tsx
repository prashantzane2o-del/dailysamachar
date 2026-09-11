"use client";

import { Menu, Search, X } from "lucide-react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";
import { getLocalizedPath } from "@/i18n/path";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import type { Category } from "@/types/news";

interface SiteHeaderClientProps {
  brand: string;
  signIn: string;
  subscribe: string;
  categories: Category[];
}

export function SiteHeaderClient({ brand, signIn, subscribe, categories }: SiteHeaderClientProps) {
  const tHeader = useTranslations("header");
  const tNavigation = useTranslations("navigation");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="container-page flex min-h-18 items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? tHeader("closeMenu") : tHeader("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
            className="text-ink hover:bg-soft focus-visible:ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 md:hidden dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <NextLink
            href={getLocalizedPath(locale, "/search")}
            aria-label={tHeader("searchStories")}
            className="text-ink hover:bg-soft focus-visible:ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            <Search aria-hidden="true" />
          </NextLink>
        </div>

        <NextLink
          href={getLocalizedPath(locale, "/")}
          className="group focus-visible:ring-focus shrink-0 rounded-sm focus-visible:ring-2"
          aria-label={brand}
        >
          <BrandLogo noLink className="h-16 w-16 object-contain" />
        </NextLink>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <NextLink
            href={getLocalizedPath(locale, "/login")}
            className="text-ink hover:text-signal focus-visible:ring-focus hidden rounded-md px-2 py-2 text-sm font-bold focus-visible:ring-2 lg:block dark:text-gray-100"
          >
            {signIn}
          </NextLink>
          <NextLink
            href={getLocalizedPath(locale, "/signup")}
            className="bg-ink text-paper focus-visible:ring-focus hidden rounded-full px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-transform hover:scale-[1.03] focus-visible:ring-2 md:block dark:bg-gray-100 dark:text-gray-900"
          >
            {subscribe}
          </NextLink>
        </div>
      </div>

      <nav
        aria-label={tNavigation("mainNavigation")}
        className="border-line hidden border-t md:block dark:border-gray-800"
      >
        <div className="container-page flex items-center gap-5 overflow-x-auto py-3">
          <NextLink
            href={getLocalizedPath(locale, "/")}
            className="text-ink hover:text-signal shrink-0 text-xs font-bold dark:text-gray-100"
          >
            Home
          </NextLink>
          {categories.map((category) => (
            <NextLink
              key={category.id}
              href={getLocalizedPath(locale, `/category/${category.slug}`)}
              className="text-muted hover:text-signal shrink-0 text-xs font-bold dark:text-gray-300"
            >
              {category.title}
            </NextLink>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <nav
          id={menuId}
          aria-label={tNavigation("mainNavigation")}
          className="border-line bg-paper border-t md:hidden dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="container-page grid gap-1 py-3">
            <NextLink
              href={getLocalizedPath(locale, "/")}
              onClick={closeMenu}
              className="text-ink hover:bg-soft rounded-md px-3 py-3 text-sm font-bold dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </NextLink>
            {categories.map((category) => (
              <NextLink
                key={category.id}
                href={getLocalizedPath(locale, `/category/${category.slug}`)}
                onClick={closeMenu}
                className="text-ink hover:bg-soft rounded-md px-3 py-3 text-sm font-semibold dark:text-gray-100 dark:hover:bg-gray-800"
              >
                {category.title}
              </NextLink>
            ))}
            <NextLink
              href={getLocalizedPath(locale, "/search")}
              onClick={closeMenu}
              className="text-ink hover:bg-soft rounded-md px-3 py-3 text-sm font-semibold dark:text-gray-100 dark:hover:bg-gray-800"
            >
              {tHeader("searchStories")}
            </NextLink>
          </div>
        </nav>
      )}
    </>
  );
}
