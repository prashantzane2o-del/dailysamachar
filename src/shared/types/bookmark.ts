export const BOOKMARKS_STORAGE_KEY = "dailysamachar:bookmarks";

export interface StoredBookmark {
  id: string;
  slug: string;
  title: string;
  category: string;
  savedAt: string;
}

export function parseBookmarks(value: string): StoredBookmark[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isStoredBookmark).slice(0, 200);
  } catch {
    return [];
  }
}

function isStoredBookmark(value: unknown): value is StoredBookmark {
  if (typeof value !== "object" || value === null) return false;
  const bookmark = value as Record<string, unknown>;
  return (
    typeof bookmark.id === "string" &&
    typeof bookmark.slug === "string" &&
    typeof bookmark.title === "string" &&
    typeof bookmark.category === "string" &&
    typeof bookmark.savedAt === "string"
  );
}
