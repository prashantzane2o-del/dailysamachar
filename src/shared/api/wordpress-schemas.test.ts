import { afterEach, describe, expect, it, vi } from "vitest";
import { wpArticleArraySchema } from "./wordpress-schemas";

describe("wpArticleArraySchema", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps valid posts and skips malformed posts", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const result = wpArticleArraySchema.parse([
      { id: 1, slug: "valid-post" },
      { id: "2", slug: "invalid-post" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, slug: "valid-post" });
    expect(warn).toHaveBeenCalledOnce();
  });
});
