import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.REVALIDATION_SECRET}`;

    if (!process.env.REVALIDATION_SECRET || authHeader !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tag, path, type } = body;

    if (tag && typeof tag === "string") {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        strategy: "tag",
        tag,
        timestamp: Date.now(),
      });
    }

    if (path && typeof path === "string") {
      const revalidationType = type === "layout" || type === "page" ? type : "page";
      revalidatePath(path, revalidationType);
      return NextResponse.json({
        revalidated: true,
        strategy: "path",
        path,
        type: revalidationType,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Bad Request: Provide a valid 'tag' or 'path' in the payload" },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}