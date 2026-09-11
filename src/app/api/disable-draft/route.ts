// src/app/api/disable-draft/route.ts

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function safeRedirectPath(value: string | null): string {
  const candidate = value?.trim() ?? "/";
  return candidate.startsWith("/") && !candidate.startsWith("//") && !candidate.includes("\\") ? candidate : "/";
}

export async function GET(request: NextRequest) {
  // 1. Next.js 15 async draftMode cookie clear karein
  const draft = await draftMode();
  draft.disable();

  // 2. Agar redirect param diya hai toh wahan redirect karein, warna homepage par
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = safeRedirectPath(searchParams.get("redirect"));

  return NextResponse.redirect(new URL(targetUrl, request.url));
}
