import { safeJson } from "@/shared/lib/safe-json";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Injects structured data without allowing CMS content to break out of the
 * script element. `safeJson` escapes HTML-sensitive characters in the JSON.
 */
export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}
