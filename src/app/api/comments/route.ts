import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeWordPressApiUrl } from "@/shared/api/wordpress-adapter";
import { stripCmsHtml } from "@/shared/lib/cms-html";
import { checkRateLimit, clientKey } from "@/shared/lib/rate-limit";

const commentSchema = z.object({
  postId: z.string().regex(/^\d+$/, "Invalid post id"),
  name: z.string().trim().min(2).max(60),
  content: z.string().trim().min(2).max(500),
});

function commentsUrl(postId: string) {
  const origin = normalizeWordPressApiUrl(process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  const url = new URL(`${origin}/wp-json/wp/v2/comments`);
  url.searchParams.set("post", postId);
  url.searchParams.set("per_page", "50");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("status", "approve");
  return url;
}

function commentFromWordPress(comment: unknown) {
  if (!comment || typeof comment !== "object") return null;
  const value = comment as { id?: unknown; author_name?: unknown; content?: { rendered?: unknown }; date?: unknown };
  if (typeof value.id !== "number" || typeof value.author_name !== "string" || typeof value.date !== "string") return null;
  const rendered = typeof value.content?.rendered === "string" ? value.content.rendered : "";
  return {
    id: String(value.id),
    name: stripCmsHtml(value.author_name).slice(0, 60) || "Reader",
    body: stripCmsHtml(rendered).slice(0, 500),
    createdAt: value.date,
  };
}

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(clientKey(request, "comments-read"), 60, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(Math.ceil(rate.retryAfter / 1000)) } });
  const postId = request.nextUrl.searchParams.get("postId") ?? "";
  if (!/^\d+$/.test(postId)) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  try {
    const response = await fetch(commentsUrl(postId), {
      headers: { Accept: "application/json" },
      next: { revalidate: 30, tags: [`comments:${postId}`] },
    });
    if (!response.ok) return NextResponse.json({ comments: [] }, { status: 200 });
    const data: unknown = await response.json();
    const comments = Array.isArray(data) ? data.map(commentFromWordPress).filter(Boolean) : [];
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("[Comments GET]", error);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(clientKey(request, "comments-write"), 5, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Please wait before posting another comment." }, { status: 429, headers: { "Retry-After": String(Math.ceil(rate.retryAfter / 1000)) } });
  const parsed = commentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please provide a valid name and comment." }, { status: 400 });

  try {
    const response = await fetch(commentsUrl(parsed.data.postId), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(process.env.WORDPRESS_AUTH_TOKEN
          ? { Authorization: `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        post: Number(parsed.data.postId),
        author_name: parsed.data.name,
        content: parsed.data.content,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[Comments POST] WordPress rejected comment", response.status, detail.slice(0, 300));
      return NextResponse.json({ error: "Comments are temporarily unavailable." }, { status: 502 });
    }

    const comment = commentFromWordPress(await response.json());
    return NextResponse.json({ comment, pending: !comment }, { status: 201 });
  } catch (error) {
    console.error("[Comments POST]", error);
    return NextResponse.json({ error: "Comments are temporarily unavailable." }, { status: 502 });
  }
}
