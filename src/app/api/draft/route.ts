import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function safeRedirectPath(value: string | null): string {
  const candidate = value?.trim() ?? "/";
  return candidate.startsWith("/") && !candidate.startsWith("//") && !candidate.includes("\\") ? candidate : "/";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  // WordPress commonly sends 'slug', 'uri', or 'p' for previews
  const slug = searchParams.get("slug") || searchParams.get("uri") || "/";

  const expectedSecret = process.env.DRAFT_SECRET_TOKEN;

  // 1. Check if the token is configured on the server
  if (!expectedSecret) {
    console.warn("DRAFT_SECRET_TOKEN is missing in environment variables.");
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
  }

  // 2. Validate the secret token
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Unauthorized. Invalid draft token." }, { status: 401 });
  }

  // 3. Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // 4. Sanitize the redirect URL to prevent Open Redirect vulnerabilities
  const targetUrl = safeRedirectPath(slug);

  // 5. Redirect the user to the draft content
  return NextResponse.redirect(new URL(targetUrl, request.url));
}
