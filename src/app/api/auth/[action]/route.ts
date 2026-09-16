// src/app/api/auth/[action]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema, signupSchema, resetSchema } from "@/features/auth/model/schemas";
import { checkRateLimit, clientKey } from "@/shared/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  
  try {
    const rate = checkRateLimit(clientKey(request, `auth:${action}`), 10, 60_000);
    if (!rate.allowed) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    const body = await request.json();
    const providerUrl = process.env.AUTH_PROVIDER_URL?.trim();

    if (!providerUrl) {
      return NextResponse.json(
        { error: "Authentication is not configured yet. Please try again later." },
        { status: 503 },
      );
    }

    const parsed =
      action === "login"
        ? loginSchema.parse(body)
        : action === "signup"
          ? signupSchema.parse(body)
          : action === "reset"
            ? resetSchema.parse(body)
            : null;

    if (!parsed) return NextResponse.json({ error: "Invalid authentication action" }, { status: 404 });

    const endpoint = new URL(`${providerUrl.replace(/\/$/, "")}/${action}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result: unknown = await response.json().catch(() => ({ error: "Authentication provider returned invalid data." }));
    if (!response.ok) return NextResponse.json({ error: "Authentication request failed." }, { status: response.status >= 500 ? 503 : 400 });

    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error(`[Auth API Error - ${action}]:`, error);
    return NextResponse.json(
      { error: "Invalid data provided. Please check your inputs." }, 
      { status: 400 }
    );
  }
}
