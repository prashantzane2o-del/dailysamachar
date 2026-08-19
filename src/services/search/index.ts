import { Article } from "@/types/news";

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query) return [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Search API returned status: ${res.status}`);
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Search API Error:", error);
    return [];
  }
}