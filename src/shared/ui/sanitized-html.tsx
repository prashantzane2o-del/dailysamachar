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
] as const;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    // ENHANCEMENT: Added aria-* and role to preserve accessibility from WordPress blocks
    "*": ["class", "id", "dir", "lang", "data-*", "aria-*", "role"],
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
    span: ["style"],
    p: ["style"],
    div: ["style"],
  },
  // ENHANCEMENT: Allowed decimals and viewport units in styles
  allowedStyles: {
    "*": {
      color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      "background-color": [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      "font-size": [/^\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh)$/],
      "font-weight": [/^\d{100,900}$/, /^normal$/, /^bold$/],
      "line-height": [/^\d+(?:\.\d+)?(?:px|em|rem|%)?$/, /^normal$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
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

  // AAA-LEVEL ENHANCEMENT: Automatically secure external links
  transformTags: {
    a: (tagName, attribs) => {
      // If link is external, enforce safe attributes
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
  // ENHANCEMENT: Proper polymorphic type for dynamic tag rendering
  as?: React.ElementType;
}

/**
 * Renders CMS HTML only after it has crossed the sanitizer boundary.
 * Prevents DOM bloat by not rendering if HTML is empty.
 */
export function SanitizedHtml({ html, className, as: Element = "div" }: SanitizedHtmlProps) {
  if (!html) return null;

  return <Element className={className} dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }} />;
}
