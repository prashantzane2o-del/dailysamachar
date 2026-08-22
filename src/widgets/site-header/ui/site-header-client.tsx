"use client";

import { Menu, Moon, Search, Sun, X } from "lucide-react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";
import { getLocalizedPath } from "@/i18n/path";
import { useTheme } from "@/providers/theme-provider";
import type { Category } from "@/types/news";

interface SiteHeaderClientProps {
  brand: string;
  signIn: string;
  subscribe: string;
  categories: Category[];
}

export function SiteHeaderClient({ brand, signIn, subscribe, categories }: SiteHeaderClientProps) {
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");
  const tNavigation = useTranslations("navigation");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const isDark = theme === "dark";
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="container-page flex min-h-18 items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2">
          <button type="button" aria-expanded={menuOpen} aria-controls={menuId} aria-label={menuOpen ? tHeader("closeMenu") : tHeader("openMenu")} onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-focus md:hidden dark:text-gray-100 dark:hover:bg-gray-800">
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <NextLink href={getLocalizedPath(locale, "/search")} aria-label={tHeader("searchStories")} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-focus dark:text-gray-100 dark:hover:bg-gray-800">
            <Search aria-hidden="true" />
          </NextLink>
        </div>

        <NextLink href={getLocalizedPath(locale, "/")} className="group shrink-0 rounded-sm focus-visible:ring-2 focus-visible:ring-focus" aria-label={brand}>
          <span className="editorial text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-ink dark:text-gray-100">
            {brand}<span className="text-signal transition-colors group-hover:text-ink dark:group-hover:text-gray-100">.</span>
          </span>
        </NextLink>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={isDark ? tCommon("lightMode") : tCommon("darkMode")} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-focus dark:text-gray-100 dark:hover:bg-gray-800">
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <LanguageSwitcher />
          <NextLink href={getLocalizedPath(locale, "/login")} className="hidden rounded-md px-2 py-2 text-sm font-bold text-ink hover:text-signal focus-visible:ring-2 focus-visible:ring-focus lg:block dark:text-gray-100">{signIn}</NextLink>
          <NextLink href={getLocalizedPath(locale, "/signup")} className="hidden rounded-full bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-paper transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-focus md:block dark:bg-gray-100 dark:text-gray-900">{subscribe}</NextLink>
        </div>
      </div>

      <nav aria-label={tNavigation("mainNavigation")} className="hidden border-t border-line md:block dark:border-gray-800">
        <div className="container-page flex items-center gap-5 overflow-x-auto py-3">
          <NextLink href={getLocalizedPath(locale, "/")} className="shrink-0 text-xs font-bold text-ink hover:text-signal dark:text-gray-100">Home</NextLink>
          {categories.map((category) => (
            <NextLink key={category.id} href={getLocalizedPath(locale, `/category/${category.slug}`)} className="shrink-0 text-xs font-bold text-muted hover:text-signal dark:text-gray-300">{category.title}</NextLink>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <nav id={menuId} aria-label={tNavigation("mainNavigation")} className="border-t border-line bg-paper md:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="container-page grid gap-1 py-3">
            <NextLink href={getLocalizedPath(locale, "/")} onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-bold text-ink hover:bg-soft dark:text-gray-100 dark:hover:bg-gray-800">Home</NextLink>
            {categories.map((category) => (
              <NextLink key={category.id} href={getLocalizedPath(locale, `/category/${category.slug}`)} onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-soft dark:text-gray-100 dark:hover:bg-gray-800">{category.title}</NextLink>
            ))}
            <NextLink href={getLocalizedPath(locale, "/search")} onClick={closeMenu} className="rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-soft dark:text-gray-100 dark:hover:bg-gray-800">{tHeader("searchStories")}</NextLink>
          </div>
        </nav>
      )}
    </>
  );
}
