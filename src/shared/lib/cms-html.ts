import sanitizeHtml from "sanitize-html";

/** Convert WordPress/CMS HTML into safe plain text for titles and metadata. */
export function stripCmsHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/** Remove WordPress's automatically appended excerpt link text. */
export function stripCmsExcerpt(html: string | null | undefined): string {
  return stripCmsHtml(html)
    .replace(/\s*(?:\.\.\.|…)?\s*read\s+more\s*$/i, "")
    .trim();
}
