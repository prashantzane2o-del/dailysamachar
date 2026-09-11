import { describe, expect, it } from "vitest";
import { mapCmsArticle } from "./mapper";

describe("mapCmsArticle", () => {
  it("maps CMS transport data into the article domain model", () => {
    const article = mapCmsArticle({
      id: "1",
      slug: "city-report",
      title: "City report",
      excerpt: "Context",
      categories: [{ name: "India", slug: "india" }],
      tags: [{ name: "Cities", slug: "cities" }],
      author: { name: "Asha", slug: "asha" },
      date: "2026-08-01",
    });
    expect(article).toMatchObject({
      slug: "city-report",
      category: { slug: "india" },
      tags: [{ slug: "cities" }],
      readingMinutes: 4,
    });
  });
});
