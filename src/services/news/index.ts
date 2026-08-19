import { Article, ArticleSummary } from "@/entities/article/model";

// GraphQL endpoint from environment variables
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://your-wordpress-site.com/graphql";

// Helper function to fetch data from WPGraphQL
async function fetchGraphQL(query: string, variables = {}) {
  try {
    const res = await fetch(WP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache behavior as per architecture rules
    });
    
    if (!res.ok) throw new Error("Failed to fetch API");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("WPGraphQL Fetch Error:", error);
    return null;
  }
}

// 1. Get Single Article by Slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const query = `
    query GetArticleBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        slug
        title
        excerpt
        content
        date
        author {
          node {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { slug });

  if (!data?.post) {
    // Fallback if WP is not connected yet, so the app doesn't crash during dev
    return {
      id: "mock-id-1",
      slug,
      title: "Sample Article Headline",
      excerpt: "This is a sample excerpt while WordPress is being connected.",
      content: "<p>This is the full article content. Connect your WordPress URL in .env to see real data.</p>",
      publishedAt: new Date().toISOString(),
      author: { name: "Editorial Desk", slug: "editorial" },
      imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
      tags: ["News"],
    };
  }

  // DTO Mapper
  const post = data.post;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt?.replace(/<[^>]+>/g, ""), // Simple HTML strip for excerpt
    content: post.content,
    publishedAt: post.date,
    author: post.author?.node ? { name: post.author.node.name, slug: post.author.node.slug } : undefined,
    imageUrl: post.featuredImage?.node?.sourceUrl,
    tags: [],
  };
}

// 2. Get Related Articles
export async function getRelatedArticles(locale: string, currentSlug: string): Promise<ArticleSummary[]> {
  // Mock logic: Ideally this fetches articles from the same category via GraphQL
  return [
    {
      id: "mock-id-2",
      slug: "related-news-1",
      title: "Market hits record highs amidst global cues",
      excerpt: "A brief summary of the related news article.",
      publishedAt: new Date().toISOString(),
      author: { name: "Market Team", slug: "market" },
    },
    {
      id: "mock-id-3",
      slug: "related-news-2",
      title: "New policies announced for tech sector",
      excerpt: "Understanding the impact of the latest tech policies.",
      publishedAt: new Date().toISOString(),
      author: { name: "Tech Desk", slug: "tech" },
    }
  ];
}

// 3. Get Featured Articles (Used in Fact Check & Home pages)
export async function getFeaturedArticles(locale: string): Promise<ArticleSummary[]> {
  // Real implementation would query posts with a specific "Featured" tag or category
  return [
    {
      id: "mock-id-4",
      slug: "fact-check-viral-video",
      title: "Fact Check: The truth behind the viral video",
      excerpt: "We analyze the claims made in the recent viral forward.",
      publishedAt: new Date().toISOString(),
      author: { name: "Fact Check Team", slug: "fact-check" },
      category: "Fact Check",
    }
  ];
}