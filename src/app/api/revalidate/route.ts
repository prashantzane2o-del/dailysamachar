import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  tag: z.string().min(1).max(120).optional(),
  path: z.string().startsWith("/").max(240).optional(),
  type: z.enum(["page", "layout"]).optional(),
  post: z.object({ post_name: z.string().regex(/^[a-z0-9-]+$/i) }).optional(),
}).strict();

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expectedSecret || authorization !== "Bearer " + expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = payloadSchema.parse(await request.json());
    if (payload.tag) {
      revalidateTag(payload.tag);
      return NextResponse.json({ revalidated: true, strategy: "tag", tag: payload.tag });
    }
    if (payload.path) {
      revalidatePath(payload.path, payload.type ?? "page");
      return NextResponse.json({ revalidated: true, strategy: "path", path: payload.path });
    }
    if (payload.post) {
      revalidatePath("/[locale]/news/" + payload.post.post_name, "page");
      return NextResponse.json({ revalidated: true, strategy: "post", slug: payload.post.post_name });
    }
    return NextResponse.json({ error: "Provide tag, path, or post.post_name" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid revalidation payload" }, { status: 400 });
    console.error("Revalidation failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
