// src/app/api/revalidate/route.ts
import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientKey } from "@/shared/lib/rate-limit";

const WORDPRESS_POSTS_TAG = "wordpress-posts";
const LEGACY_WORDPRESS_TAG = "wordpress";

// Schema to validate WordPress webhook payload
const safeSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .refine((value) => !/[\\/?#]/.test(value), "Slug must be a single URL segment");

const webhookPayloadSchema = z
  .object({
    action: z.string().trim().max(40).optional(),
    post_type: z.string().trim().max(40).optional(),
    type: z.string().trim().max(40).optional(),
    post_id: z.union([z.string(), z.number()]).optional(),
    id: z.union([z.string(), z.number()]).optional(),
    post_name: safeSlugSchema.optional(),
    slug: safeSlugSchema.optional(),
    post: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
        post_name: safeSlugSchema.optional(),
        slug: safeSlugSchema.optional(),
        post_type: z.string().trim().max(40).optional(),
      })
      .optional(),
  })
  .passthrough();

// Utility to read secret token from headers or query params
function readSecret(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : null;

  return (
    request.headers.get("x-revalidation-secret")?.trim() ||
    bearerSecret ||
    request.nextUrl.searchParams.get("secret")?.trim() ||
    null
  );
}

// Securely compare secrets to prevent timing attacks
function secretsMatch(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;

  try {
    const providedBytes = Buffer.from(provided);
    const expectedBytes = Buffer.from(expected);

    if (providedBytes.length !== expectedBytes.length) return false;
    return timingSafeEqual(providedBytes, expectedBytes);
  } catch {
    return false;
  }
}

// Invalidate main feeds and cache tags
function invalidateGlobalContent(): void {
  revalidatePath("/");
  revalidatePath("/en", "layout");
  revalidatePath("/hi", "layout");
  revalidateTag(WORDPRESS_POSTS_TAG);
  revalidateTag(LEGACY_WORDPRESS_TAG);
}

// Invalidate specific post
function invalidatePost(slug: string): void {
  const encodedSlug = encodeURIComponent(slug);
  revalidatePath(`/news/${encodedSlug}`);
  revalidatePath(`/en/news/${encodedSlug}`);
  revalidatePath(`/hi/news/${encodedSlug}`);
  invalidateGlobalContent();
}

/**
 * WordPress on-demand revalidation webhook.
 * Expected to be called by WordPress when a post is created, updated, or deleted.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rate = checkRateLimit(clientKey(request, "revalidation"), 30, 60_000);
    if (!rate.allowed) return NextResponse.json({ revalidated: false, message: "Too many requests." }, { status: 429 });
    const expectedSecret = process.env.REVALIDATION_SECRET_TOKEN ?? process.env.REVALIDATION_SECRET;

    // 1. Verify Secret Token
    if (!secretsMatch(readSecret(request), expectedSecret)) {
      console.warn("[Revalidation] Unauthorized attempt");
      return NextResponse.json({ revalidated: false, message: "Unauthorized. Invalid secret token." }, { status: 401 });
    }

    // 2. Parse Payload
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ revalidated: false, message: "Invalid JSON body provided." }, { status: 400 });
    }

    const parsedBody = webhookPayloadSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      console.error("[Revalidation] Invalid payload format", parsedBody.error);
      return NextResponse.json({ revalidated: false, message: "Invalid WordPress webhook payload." }, { status: 400 });
    }

    const nestedPost = parsedBody.data.post;
    const postType = parsedBody.data.post_type ?? parsedBody.data.type ?? nestedPost?.post_type ?? "post";
    const slug = parsedBody.data.post_name ?? parsedBody.data.slug ?? nestedPost?.post_name ?? nestedPost?.slug;

    // 3. Clear Cache based on Payload
    if (postType === "post" && slug) {
      invalidatePost(slug);
      console.log(`[Revalidation] Cleared cache for post: ${slug}`);
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        message: `Successfully revalidated paths for post: ${slug}`,
      });
    }

    // Fallback: Clear global cache if specific slug isn't found
    invalidateGlobalContent();
    console.log(`[Revalidation] Cleared global cache`);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: "Successfully revalidated global feeds.",
    });
  } catch (error) {
    console.error("[Revalidation Error]:", error);
    return NextResponse.json(
      { revalidated: false, message: "Internal server error during revalidation." },
      { status: 500 },
    );
  }
}
