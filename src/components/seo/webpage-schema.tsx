import { getLocalizedPath } from "@/i18n/path";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/shared/ui/json-ld";

export function WebPageSchema({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
  const url = `${baseUrl}${getLocalizedPath(locale, path)}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { "@id": `${baseUrl}/#website` },
        publisher: { "@id": `${baseUrl}/#organization` },
      }}
    />
  );
}
