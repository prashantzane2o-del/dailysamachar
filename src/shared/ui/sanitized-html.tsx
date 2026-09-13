// src/shared/ui/sanitized-html.tsx
import React from "react";
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
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "iframe",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "ul",
  "div",
  "span",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "video",
  "audio",
  "source",
  "nav",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "hr",
  "del",
  "ins",
  "sub",
  "sup",
  "kbd",
  "s",
  "mark",
  "colgroup",
  "col", // FIXED: Added mark (for highlights), colgroup, col (for tables)
] as const;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    // FIXED: Allowed 'style' and 'class' globally so WP block classes aren't stripped
    "*": ["class", "className", "id", "dir", "lang", "data-*", "aria-*", "role", "style"],
    a: ["href", "target", "rel", "title", "download"],
    img: [
      "src",
      "alt",
      "width",
      "height",
      "loading",
      "srcset",
      "sizes",
      "title",
      "decoding",
      "data-src",
      "data-srcset",
      "data-lazy-src",
    ],
    iframe: ["src", "title", "width", "height", "allowfullscreen", "loading", "allow", "frameborder"],
    video: ["src", "controls", "width", "height", "autoplay", "muted", "loop", "poster", "playsinline"],
    source: ["src", "type"],
    td: ["colspan", "rowspan", "align", "valign"],
    th: ["colspan", "rowspan", "align", "valign", "scope"],
    col: ["span"],
    colgroup: ["span"],
  },
  // FIXED: Expanded allowed CSS styles to support WP highlights, table widths, and text colors
  allowedStyles: {
    "*": {
      color: [/^.*$/],
      "background-color": [/^.*$/],
      background: [/^.*$/],
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      "font-size": [/^.*$/],
      "font-weight": [/^.*$/],
      "line-height": [/^.*$/],
      "text-decoration": [/^.*$/],
      width: [/^.*$/],
      height: [/^.*$/],
      margin: [/^.*$/],
      padding: [/^.*$/],
      border: [/^.*$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel", "data"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowedIframeHostnames: [
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "twitter.com",
    "platform.twitter.com",
    "player.vimeo.com",
    "open.spotify.com",
  ],
  allowProtocolRelative: true,
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.href && /^https?:\/\//.test(attribs.href)) {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        };
      }
      return { tagName: "a", attribs };
    },
  },
};

export function sanitizeCmsHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", SANITIZE_OPTIONS);
}

export function stripCmsHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

interface SanitizedHtmlProps {
  html: string | null | undefined;
  className?: string;
  as?: React.ElementType;
}

export function SanitizedHtml({ html, className, as: Element = "div" }: SanitizedHtmlProps) {
  if (!html) return null;
  return <Element className={className} dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }} />;
}
