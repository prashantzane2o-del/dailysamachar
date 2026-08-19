"use client";

import DOMPurify from "isomorphic-dompurify"; // npm install isomorphic-dompurify

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

export function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  // Safe HTML rendering for WordPress content
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'img', 'figure', 'figcaption'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class'],
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHtml }} 
    />
  );
}
