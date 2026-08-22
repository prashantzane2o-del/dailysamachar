import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "ul",
] as const;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    "*": ["class"],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
};

export function sanitizeCmsHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", SANITIZE_OPTIONS);
}

export function stripCmsHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    ...SANITIZE_OPTIONS,
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

type SanitizedHtmlElement = "div" | "span" | "p" | "h2" | "h3" | "h4" | "blockquote";

interface SanitizedHtmlProps {
  html: string | null | undefined;
  className?: string;
  as?: SanitizedHtmlElement;
}

/** Renders CMS HTML only after it has crossed the sanitizer boundary. */
export function SanitizedHtml({ html, className, as = "div" }: SanitizedHtmlProps) {
  const Element = as;

  return <Element className={className} dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }} />;
}
