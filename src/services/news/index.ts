import { Article } from "@/types/news";
import { articles } from "./content";

export * from "./content";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    const response = await fetch(`${apiUrl}/api/news?category=${slug}`, {
      next: { 
        revalidate: 60, 
        tags: ["articles", `category-${slug}`] 
      },
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      console.warn(`[News Service] Failed to fetch or no articles found for category: ${slug}. Status: ${response.status}`);
      return articles.filter((article) => article.category.toLowerCase() === slug.toLowerCase());
    }

    const data = await response.json();
    
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    
    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    return articles;
  } catch (error) {
    console.error(`[News Service] Exception occurred while fetching articles for category ${slug}:`, error);
    return articles;
  }
}

export async function getFeaturedArticles(locale: string): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    const response = await fetch(`${apiUrl}/api/news/featured?locale=${locale}`, {
      next: { 
        revalidate: 60, 
        tags: ["articles", "featured", locale] 
      },
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      console.warn(`[News Service] Failed to fetch featured articles. Status: ${response.status}`);
      return articles;
    }

    const data = await response.json();
    
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    
    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    return articles;
  } catch (error) {
    console.error("[News Service] Exception occurred while fetching featured articles:", error);
    return [];
  }
}

export async function getRelatedArticles(locale: string, context: string): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    const response = await fetch(`${apiUrl}/api/news/related?locale=${locale}&context=${context}`, {
      next: { 
        revalidate: 60, 
        tags: ["articles", "related", locale, context] 
      },
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      console.warn(`[News Service] Failed to fetch related articles. Status: ${response.status}`);
      return articles;
    }

    const data = await response.json();
    
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    
    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("[News Service] Exception occurred while fetching related articles:", error);
    return [];
  }
}
