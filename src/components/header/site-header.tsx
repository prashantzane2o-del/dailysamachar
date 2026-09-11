"use client";

import { Menu, Search, X } from "lucide-react";
import NextLink from "next/link";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { getLocalizedPath } from "@/i18n/path";
import { MAIN_NAVIGATION } from "@/shared/config/navigation";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { useScrollDirection } from "@/shared/hooks/use-scroll-direction";
import { BrandLogo } from "@/shared/ui/brand-logo";

export function SiteHeader({ themeToggle }: { themeToggle: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  useClickOutside(headerRef, () => setOpen(false), { enabled: open });
  useClickOutside(searchDialogRef, () => setSearch(false), { enabled: search });
  const switchLocale = () => {
    const pathWithoutLocale = pathname.replace(/^\/(?:en|hi)(?=\/|$)/, "") || "/";
    router.replace(getLocalizedPath(locale === "hi" ? "en" : "hi", pathWithoutLocale));
  };
  const trends = t.raw("header.trends") as string[];

  return (
    <>
      <header
        ref={headerRef}
        className={`border-line bg-paper/95 dark:bg-ink/95 sticky top-0 z-30 border-b backdrop-blur transition-transform duration-300 ${
          scrollDirection === "down" && !open && !search ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            className="hover:bg-soft rounded-lg p-2 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <NextLink
            href={getLocalizedPath(locale, "/")}
            className="focus-visible:ring-focus flex shrink-0 items-center gap-2 rounded-lg focus-visible:ring-2"
          >
            <BrandLogo noLink className="h-14 w-14 object-contain" />
          </NextLink>
          <nav aria-label="Main navigation" className="hidden h-full items-center gap-5 md:flex">
            {MAIN_NAVIGATION.map(({ title, href }) => (
              <NextLink
                className="hover:text-ink after:bg-signal relative text-xs font-bold text-slate-600 transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full dark:text-slate-300"
                href={getLocalizedPath(locale, href)}
                key={href}
                onClick={() => setOpen(false)}
              >
                {title}
              </NextLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={t("common.language")}
              onClick={switchLocale}
              className="hover:bg-soft rounded-lg px-2 py-1 text-xs font-bold"
            >
              {locale === "hi" ? t("common.switchToEnglish") : t("common.switchToHindi")}
            </button>
            <span className="hidden sm:block">{themeToggle}</span>
            <button
              type="button"
              aria-label={t("header.search")}
              className="hover:bg-soft rounded-lg p-2"
              onClick={() => setSearch(true)}
            >
              <Search size={19} />
            </button>
            <NextLink
              href={getLocalizedPath(locale, "/newsletters")}
              className="bg-signal hidden rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-800 sm:block"
            >
              {t("header.subscribe")}
            </NextLink>
          </div>
        </div>
        {open && (
          <nav className="container-page border-line border-t py-4 md:hidden" aria-label="Main navigation">
            {MAIN_NAVIGATION.map(({ title, href }) => (
              <NextLink
                href={getLocalizedPath(locale, href)}
                key={href}
                className="block py-2 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                {title}
              </NextLink>
            ))}
          </nav>
        )}
      </header>
      {search && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("header.search")}
          className="bg-ink/30 fixed inset-0 z-50 grid place-items-start p-4 pt-24 backdrop-blur-sm"
        >
          <div ref={searchDialogRef} className="bg-paper w-full max-w-2xl rounded-2xl p-5 shadow-2xl dark:bg-slate-950">
            <form
              action={getLocalizedPath(locale, "/search")}
              className="flex items-center gap-3 border-b pb-3"
              onSubmit={() => setSearch(false)}
            >
              <Search size={21} className="text-signal" />
              <input
                autoFocus
                aria-label={t("header.searchStories")}
                name="q"
                placeholder={t("header.searchPlaceholder")}
                required
                className="w-full bg-transparent text-lg outline-none placeholder:text-slate-400"
              />
              <button type="button" aria-label={t("header.closeMenu")} onClick={() => setSearch(false)}>
                <X size={20} />
              </button>
            </form>
            <p className="text-muted mt-5 text-xs font-bold tracking-widest">{t("header.trending")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trends.map((trend) => (
                <NextLink
                  href={getLocalizedPath(locale, `/search?q=${encodeURIComponent(trend)}`)}
                  onClick={() => setSearch(false)}
                  key={trend}
                  className="hover:border-signal hover:text-signal rounded-full border px-3 py-1.5 text-sm"
                >
                  {trend}
                </NextLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
