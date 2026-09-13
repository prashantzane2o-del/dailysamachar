import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_WORDPRESS_API_URL, normalizeWordPressApiUrl, WordPressAdapter } from "./wordpress-adapter";

describe("normalizeWordPressApiUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses the documented production endpoint when no URL is configured", () => {
    expect(normalizeWordPressApiUrl(undefined)).toBe(DEFAULT_WORDPRESS_API_URL);
  });

  it("normalizes a WordPress REST endpoint to its site origin", () => {
    expect(normalizeWordPressApiUrl("https://cms.example.test/wp-json/wp/v2/")).toBe("https://cms.example.test");
  });

  it("keeps a deliberate local development origin", () => {
    expect(normalizeWordPressApiUrl("http://127.0.0.1:8000")).toBe("http://127.0.0.1:8000");
  });

  it("rejects invalid and unsupported endpoints", () => {
    expect(() => normalizeWordPressApiUrl("not-a-url")).toThrow("valid absolute HTTP(S) URL");
    expect(() => normalizeWordPressApiUrl("file:///tmp/wordpress")).toThrow("must use HTTP or HTTPS");
  });

  it("retries a failed connection once and shares the request across concurrent CMS reads", async () => {
    const networkError = new TypeError("fetch failed", {
      cause: Object.assign(new Error("connection reset"), { code: "ECONNRESET" }),
    });
    const fetchMock = vi.fn().mockRejectedValue(networkError);
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const adapter = new WordPressAdapter();

    await expect(
      Promise.all([adapter.getPosts(), adapter.getCategories(), adapter.getCategoryBySlug("breaking")]),
    ).resolves.toEqual([{ data: [], totalPages: 0 }, [], null]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fetches every WordPress page for the post sitemap", async () => {
    const response = (posts: Array<{ id: number; slug: string; date: string; modified: string }>, totalPages: string) =>
      new Response(JSON.stringify(posts), {
        headers: { "X-WP-TotalPages": totalPages },
      });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response([{ id: 1, slug: "first", date: "2026-01-01", modified: "2026-01-02" }], "2"))
      .mockResolvedValueOnce(response([{ id: 2, slug: "second", date: "2026-01-03", modified: "2026-01-04" }], "2"));
    vi.stubGlobal("fetch", fetchMock);

    const adapter = new WordPressAdapter();
    await expect(adapter.getPostSitemapEntries()).resolves.toEqual([
      {
        slug: "first",
        publishedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      },
      {
        slug: "second",
        publishedAt: "2026-01-03T00:00:00.000Z",
        updatedAt: "2026-01-04T00:00:00.000Z",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("page=1");
    expect(fetchMock.mock.calls[1]?.[0]).toContain("page=2");
  });

  it("retries transient server responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "temporary failure" }), { status: 503 }))
      .mockResolvedValueOnce(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const adapter = new WordPressAdapter();

    await expect(adapter.getCategories()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent client errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("not found", { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const adapter = new WordPressAdapter();

    await expect(adapter.getCategories()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
