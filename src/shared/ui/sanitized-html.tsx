// src/shared/ui/sanitized-html.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "iframe",
  "img",
  "ins",
  "kbd",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "p",
  "picture",
  "pre",
  "q",
  "s",
  "section",
  "small",
  "source",
  "span",
  "strong",
  "summary",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "time",
  "track",
  "tr",
  "u",
  "ul",
  "video",
  "wbr",
] as const;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    "*": ["class", "id", "dir", "lang", "data-*", "aria-*", "role", "style", "title"],
    a: ["href", "target", "rel", "title", "download", "aria-label"],
    abbr: ["title"],
    area: ["alt", "coords", "href", "shape", "target"],
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
    iframe: [
      "src",
      "title",
      "width",
      "height",
      "allowfullscreen",
      "loading",
      "allow",
      "frameborder",
      "scrolling",
      "referrerpolicy",
    ],
    video: [
      "src",
      "controls",
      "width",
      "height",
      "autoplay",
      "muted",
      "loop",
      "poster",
      "playsinline",
      "preload",
      "aria-label",
    ],
    audio: ["src", "controls", "autoplay", "muted", "loop", "preload", "aria-label"],
    source: ["src", "type", "media", "sizes", "srcset"],
    track: ["kind", "label", "src", "srclang", "default"],
    time: ["datetime"],
    td: ["colspan", "rowspan", "align", "valign"],
    th: ["colspan", "rowspan", "align", "valign", "scope"],
    col: ["span"],
    colgroup: ["span"],
    ol: ["start", "reversed", "type"],
    li: ["value"],
  },
  allowedStyles: {
    "*": {
      color: [/^(?!.*(?:url|expression|javascript|@import))/i],
      "background-color": [/^(?!.*(?:url|expression|javascript|@import))/i],
      background: [/^(?!.*(?:url|expression|javascript|@import))/i],
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      "font-size": [/^(?!.*(?:url|expression|javascript|@import))/i],
      "font-weight": [/^(?!.*(?:url|expression|javascript|@import))/i],
      "line-height": [/^(?!.*(?:url|expression|javascript|@import))/i],
      "text-decoration": [/^(?!.*(?:url|expression|javascript|@import))/i],
      width: [/^(?!.*(?:url|expression|javascript|@import))/i],
      height: [/^(?!.*(?:url|expression|javascript|@import))/i],
      margin: [/^(?!.*(?:url|expression|javascript|@import))/i],
      padding: [/^(?!.*(?:url|expression|javascript|@import))/i],
      border: [/^(?!.*(?:url|expression|javascript|@import))/i],
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
    "www.facebook.com",
    "www.instagram.com",
  ],
  allowProtocolRelative: false,
  transformTags: {
    // Article pages already provide the document h1; CMS headings begin at h2.
    h1: "h2",
    img: (_tagName, attribs) => ({
      tagName: "img",
      attribs: {
        ...attribs,
        alt: attribs.alt?.trim() || "",
        loading: attribs.loading === "eager" ? "eager" : "lazy",
        decoding: "async",
      },
    }),
    iframe: (_tagName, attribs) => ({
      tagName: "iframe",
      attribs: {
        ...attribs,
        title: attribs.title?.trim() || "Embedded content",
        loading: "lazy",
        referrerpolicy: "strict-origin-when-cross-origin",
      },
    }),
    video: (_tagName, attribs) => ({
      tagName: "video",
      attribs: { ...attribs, controls: "controls", preload: "metadata" },
    }),
    audio: (_tagName, attribs) => ({
      tagName: "audio",
      attribs: { ...attribs, controls: "controls", preload: "metadata" },
    }),
    a: (tagName, attribs) => {
      if (attribs.href && /^https?:\/\//.test(attribs.href)) {
        return {
          tagName,
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
  let processed = html ?? "";

  // CMS inline colors can be unreadable in the active theme. Keep layout styles,
  // but let the application theme control text and surfaces for consistent contrast.
  processed = processed.replace(/\sstyle=(['"])(.*?)\1/gi, (_match, quote: string, styles: string) => {
    const themeSafeStyles = styles
      .split(";")
      .filter((declaration) => !/^\s*(color|background|background-color)\s*:/i.test(declaration))
      .join(";")
      .trim();

    return themeSafeStyles ? ` style=${quote}${themeSafeStyles}${quote}` : "";
  });

  // FIX 6: Wrap tables to prevent mobile overflow breaking
  processed = processed.replace(/(<table[^>]*>)/gi, '<div class="wp-table-responsive-wrapper">$1');
  processed = processed.replace(/(<\/table>)/gi, "$1</div>");

  // FIX 3: Wrap iframes to maintain 16:9 aspect ratio on mobile
  processed = processed.replace(/(<iframe[^>]*>)/gi, '<div class="wp-iframe-responsive-wrapper">$1');
  processed = processed.replace(/(<\/iframe>)/gi, "$1</div>");

  return sanitizeHtml(processed, SANITIZE_OPTIONS);
}

interface SanitizedHtmlProps {
  html: string | null | undefined;
  className?: string;
  as?: React.ElementType;
}

export function SanitizedHtml({ html, className, as: Element = "div" }: SanitizedHtmlProps) {
  const containerRef = useRef<HTMLElement>(null);
  const sanitizedHtml = useMemo(() => sanitizeCmsHtml(html), [html]);

  // FIX 4 (Part 2): Hydrate Twitter/Instagram embeds after they are injected into the DOM
  useEffect(() => {
    if (!containerRef.current) return;

    const embedWindow = window as Window & {
      twttr?: { widgets?: { load?: (element: HTMLElement) => void } };
      instgrm?: { Embeds?: { process?: () => void } };
    };

    if (typeof embedWindow.twttr?.widgets?.load === "function") {
      embedWindow.twttr.widgets.load(containerRef.current);
    }

    if (typeof embedWindow.instgrm?.Embeds?.process === "function") {
      embedWindow.instgrm.Embeds.process();
    }
  }, [html]);

  if (!html) return null;

  return <Element ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
