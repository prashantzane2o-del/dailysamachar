import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, clientKey } from "@/shared/lib/rate-limit";

const requestSchema = z.object({
  texts: z.array(z.string().max(40_000)).min(1).max(4),
  source: z.enum(["hi", "en"]),
  target: z.enum(["hi", "en"]),
});

async function translateWithMyMemory(texts: string[], source: "hi" | "en", target: "hi" | "en") {
  const translated = await Promise.all(
    texts.map(async (text) => {
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", text);
      url.searchParams.set("langpair", `${source}|${target}`);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Free translation returned ${response.status}`);
      const result = (await response.json()) as { responseData?: { translatedText?: string } };
      const value = result.responseData?.translatedText;
      if (!value) throw new Error("Free translation returned empty text");
      return value;
    }),
  );
  return translated;
}

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(clientKey(request, "translation"), 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many translation requests. Please try again shortly." }, { status: 429 });
    }
    const input = requestSchema.parse(await request.json());

    if (input.source === input.target) {
      return NextResponse.json({ texts: input.texts });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey || apiKey === "replace-with-google-translate-api-key") {
      const texts = await translateWithMyMemory(input.texts, input.source, input.target);
      return NextResponse.json({ texts });
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
