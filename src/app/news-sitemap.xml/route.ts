import { cmsApi } from "@/shared/api/cms";
import { getLocalizedPath } from "@/i18n/path";
import { routing } from "@/i18n/routing";
import { stripCmsHtml } from "@/shared/lib/cms-html";

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(): Promise<Response> {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://dailysamachar.org").replace(/\/$/, "");
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const posts = await cmsApi.getArticles({ perPage: 100 }).catch((error: unknown) => {
    console.error("Failed to build news sitemap", error);
    return [];
  });
  const urls = posts
    .filter((article) => new Date(article.publishedAt).getTime() >= cutoff)
    .flatMap((article) =>
      routing.locales.map((locale) => {
        const path = getLocalizedPath(locale, `/news/${encodeURIComponent(article.slug)}`);
        const title = stripCmsHtml(article.title) || "DailySamachar story";
        return `<url><loc>${escapeXml(`${origin}${path}`)}</loc><news:news><news:publication><news:name>DailySamachar</news:name><news:language>${locale}</news:language></news:publication><news:publication_date>${escapeXml(article.publishedAt)}</news:publication_date><news:title>${escapeXml(title)}</news:title></news:news></url>`;
      }),
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": XML_CONTENT_TYPE, "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
