import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];

export function isSupportedLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value);
}

// --- Routing Configuration ---
export const routing = defineRouting({
  // A list of all locales that are supported by your news platform
  locales,

  // Used when no locale matches the incoming request
  defaultLocale: "en",

  // Keep the default locale's URLs clean while still prefixing other locales
  // (for example, /news/slug and /hi/news/slug).
  localePrefix: "as-needed",
});

// --- Navigation APIs ---
// Lightweight wrappers around Next.js' navigation APIs that automatically
// consider the routing configuration and append the correct locale prefix.

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
