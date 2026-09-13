// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response: NextResponse;

  // 1. Route Handling (API vs Frontend)
  if (pathname.startsWith("/api")) {
    // Skip next-intl translation routing for /api/* endpoints
    response = request.method === "OPTIONS" ? new NextResponse(null, { status: 204 }) : NextResponse.next();

    // Strict but Dynamic CORS for API routes
    const origin = request.headers.get("origin") ?? "";
    
    const isLocalhost = origin.startsWith("http://localhost:");
    const isProduction = origin === "https://dailysamachar.org" || origin === "https://api.dailysamachar.org";
    const isVercelPreview = origin.endsWith(".vercel.app");

    // Only allow specific origins or dynamic preview/local environments
    if (isLocalhost || isProduction || isVercelPreview) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Vary", "Origin");
    }

    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "600");
  } else {
    // Process standard frontend routes through next-intl
    response = intlMiddleware(request);
  }

  // 2. Enforce dynamic security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  // Matcher includes all paths EXCEPT static files, manifests, and internal Next.js assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|robots.txt|news-sitemap.xml|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js)$).*)",
  ],
};