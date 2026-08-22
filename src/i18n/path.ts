/**
 * Build a route that follows the application's `localePrefix: "as-needed"`
 * configuration without importing the generated next-intl Link component.
 *
 * Keeping this helper framework-agnostic lets client components use
 * `next/link` directly, which avoids a React Client Manifest edge case in
 * Next.js 15 when a generated next-intl navigation component crosses a
 * server-to-client boundary.
 */
export function getLocalizedPath(locale: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === "en") {
    return normalizedPath;
  }

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}
