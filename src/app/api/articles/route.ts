import { NextRequest, NextResponse } from "next/server";
import { cmsApi } from "@/shared/api/cms";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getCategoryFilter(value: string | null): { categoryId?: number; categorySlug?: string } {
  const normalized = value?.trim().slice(0, 120);
  if (!normalized) return {};

  if (/^\d+$/.test(normalized)) {
    return { categoryId: Number(normalized) };
  }

  return { categorySlug: normalized };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const page = parsePositiveInteger(request.nextUrl.searchParams.get("page"), 1);
  const perPage = Math.min(
    MAX_PAGE_SIZE,
    parsePositiveInteger(request.nextUrl.searchParams.get("perPage"), DEFAULT_PAGE_SIZE),
  );
  const category = getCategoryFilter(
    request.nextUrl.searchParams.get("categoryId") ?? request.nextUrl.searchParams.get("categorySlug"),
  );

  try {
    const data = await cmsApi.getArticles({ page, perPage, ...category });
    const nextCursor = data.length === perPage ? page + 1 : null;

    return NextResponse.json(
      { data, nextCursor },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    console.error("Failed to load article feed", error);
    return NextResponse.json({ error: "Articles unavailable" }, { status: 503 });
  }
}
