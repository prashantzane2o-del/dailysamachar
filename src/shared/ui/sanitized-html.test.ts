import { describe, expect, it } from "vitest";
import { sanitizeCmsHtml } from "./sanitized-html";

describe("sanitizeCmsHtml", () => {
  it("preserves WordPress heading hierarchy and heading text", () => {
    const html =
      '<h1 class="wp-block-heading">मुख्य शीर्षक</h1><h2 class="wp-block-heading">उपशीर्षक</h2><h3>विवरण</h3>';

    const sanitized = sanitizeCmsHtml(html);

    expect(sanitized).toContain('<h1 class="wp-block-heading">मुख्य शीर्षक</h1>');
    expect(sanitized).toContain('<h2 class="wp-block-heading">उपशीर्षक</h2>');
    expect(sanitized).toContain("<h3>विवरण</h3>");
    expect(sanitized).not.toContain('<h2 class="wp-block-heading">मुख्य शीर्षक</h2>');
  });
});
