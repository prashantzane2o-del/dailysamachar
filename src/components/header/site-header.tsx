"use client";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/widgets/widgets";

const navigationKeys = [
  "india",
  "world",
  "politics",
  "business",
  "technology",
  "sports",
  "entertainment",
  "lifestyle",
  "opinion",
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const switchLocale = () => router.replace(pathname, { locale: locale === "hi" ? "en" : "hi" });
  const trends = t.raw("header.trends") as string[];

  return (
    <>
      <header className="border-line bg-paper/95 sticky top-0 z-30 border-b backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            className="hover:bg-soft rounded-lg p-2 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="editorial text-2xl font-black tracking-tight">
            {t("common.brand")}
          </Link>
          <nav aria-label={t("navigation.india")} className="hidden h-full items-center gap-5 md:flex">
            {navigationKeys.slice(0, 6).map((key) => (
              <Link
                className="hover:text-ink after:bg-signal relative text-xs font-bold text-slate-600 transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full"
                href={`/#${key}`}
                key={key}
              >
                {t(`navigation.${key}`)}
              </Link>
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
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
            <button
              type="button"
              aria-label={t("header.search")}
              className="hover:bg-soft rounded-lg p-2"
              onClick={() => setSearch(true)}
            >
              <Search size={19} />
            </button>
            <button
              type="button"
              className="bg-signal hidden rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-800 sm:block"
            >
              {t("header.subscribe")}
            </button>
          </div>
        </div>
        {open && (
          <nav className="container-page border-line border-t py-4 md:hidden">
            {navigationKeys.map((key) => (
              <Link href={`/#${key}`} key={key} className="block py-2 text-sm font-semibold">
                {t(`navigation.${key}`)}
              </Link>
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
          <div className="bg-paper w-full max-w-2xl rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b pb-3">
              <Search size={21} className="text-signal" />
              <input
                autoFocus
                aria-label={t("header.searchStories")}
                placeholder={t("header.searchPlaceholder")}
                className="w-full bg-transparent text-lg outline-none placeholder:text-slate-400"
              />
              <button type="button" aria-label={t("header.closeMenu")} onClick={() => setSearch(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="text-muted mt-5 text-xs font-bold tracking-widest">{t("header.trending")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trends.map((trend) => (
                <button
                  type="button"
                  key={trend}
                  className="hover:border-signal hover:text-signal rounded-full border px-3 py-1.5 text-sm"
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
