import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  texts: z.array(z.string().max(40_000)).min(1).max(4),
  source: z.enum(["hi", "en"]),
  target: z.enum(["hi", "en"]),
});

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json());

    if (input.source === input.target) {
      return NextResponse.json({ texts: input.texts });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey || apiKey === "replace-with-google-translate-api-key") {
      return NextResponse.json({ error: "Google Translate is not configured yet." }, { status: 503 });
    }

    const endpoint = process.env.GOOGLE_TRANSLATE_API_URL || "https://translation.googleapis.com/language/translate/v2";
    const url = new URL(endpoint);
    url.searchParams.set("key", apiKey);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: input.texts,
        source: input.source,
        target: input.target,
        format: "html",
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Google Translate returned ${response.status}`);
    const result = (await response.json()) as {
      data?: { translations?: Array<{ translatedText?: string }> };
    };
    const translated = result.data?.translations?.map((translation) => translation.translatedText || "");
    if (!translated || translated.length !== input.texts.length || translated.some((text) => !text)) {
      throw new Error("Google Translate returned incomplete text");
    }

    return NextResponse.json({ texts: translated });
  } catch (error) {
    console.error("[translate] request failed", error);
    return NextResponse.json({ error: "Translation is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
