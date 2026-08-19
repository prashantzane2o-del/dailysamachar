import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // URLs 
  localePrefix: 'as-needed' 
});

// exported modules FSD features
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);