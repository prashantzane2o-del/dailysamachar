"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedPath } from "@/i18n/path";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";
import { BOOKMARKS_STORAGE_KEY, parseBookmarks, type StoredBookmark } from "@/shared/types/bookmark";

export function BookmarksPage() {
  const locale = useLocale();
  const t = useTranslations("bookmarks");
  const [bookmarks, setBookmarks] = useLocalStorage<StoredBookmark[]>(BOOKMARKS_STORAGE_KEY, [], {
    deserializer: parseBookmarks,
  });

  return (
    <section className="container-page py-12 sm:py-16">
      <p className="kicker">{t("eyebrow")}</p>
      <h1 className="editorial mt-2 text-5xl font-bold">{t("title")}</h1>
      <p className="text-muted mt-3 max-w-2xl">{t("description")}</p>

      {bookmarks.length === 0 ? (
        <div className="border-line text-muted mt-8 rounded-xl border border-dashed p-12 text-center" role="status">
          {t("empty")}
        </div>
      ) : (
        <ul className="mt-8 divide-y rounded-xl border">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="kicker">{bookmark.category}</p>
                <Link
                  href={getLocalizedPath(locale, `/news/${bookmark.slug}`)}
                  className="editorial mt-1 block truncate text-xl font-bold hover:underline"
                >
                  {bookmark.title}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setBookmarks((current) => current.filter((item) => item.id !== bookmark.id))}
                className="shrink-0 rounded-lg border px-3 py-2 text-xs font-bold hover:border-red-500 hover:text-red-600"
              >
                {t("remove")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
