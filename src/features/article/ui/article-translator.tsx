"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Languages, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsHtml } from "@/shared/lib/cms-html";

type ArticleTranslatorProps = {
  title: string;
  excerpt: string;
  content: string;
  locale: string;
  inBriefLabel: string;
  metadata: ReactNode;
};

export function ArticleTranslator({ title, excerpt, content, locale, inBriefLabel, metadata }: ArticleTranslatorProps) {
  const t = useTranslations("articleToolbar");
  const originalLanguage = locale === "hi" ? "hi" : "en";
  const [targetLanguage, setTargetLanguage] = useState<"hi" | "en">(originalLanguage);
  const [translated, setTranslated] = useState({ title, excerpt, content });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const announceLanguageChange = (nextTitle: string, nextExcerpt: string, nextContent: string, language: string) => {
    window.dispatchEvent(
      new CustomEvent("article-language-change", {
        detail: {
          text: stripCmsHtml(`${nextTitle} ${nextExcerpt} ${nextContent}`),
          locale: language,
        },
      }),
    );
  };

  const translateArticle = async (target: "hi" | "en") => {
    if (target === originalLanguage) {
      setTargetLanguage(target);
      setTranslated({ title, excerpt, content });
      announceLanguageChange(title, excerpt, content, target);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: [title, excerpt, content], source: originalLanguage, target }),
      });
      const result = (await response.json()) as { texts?: string[]; error?: string };
      if (!response.ok || !result.texts || result.texts.length !== 3) {
        throw new Error(result.error || "Translation failed");
      }
      setTranslated({ title: result.texts[0], excerpt: result.texts[1], content: result.texts[2] });
      setTargetLanguage(target);
      announceLanguageChange(result.texts[0], result.texts[1], result.texts[2], target);
    } catch (translationError) {
      setError(translationError instanceof Error ? translationError.message : "Translation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-muted text-sm" role="status" aria-live="polite">
          {targetLanguage === "hi" ? "हिंदी" : "English"}
        </span>
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label={t("translateArticle", { fallback: "Translate article" })}
        >
          <Languages aria-hidden="true" className="text-signal h-4 w-4" />
          {(["en", "hi"] as const).map((language) => (
            <button
              key={language}
              type="button"
              disabled={isLoading || targetLanguage === language}
              onClick={() => translateArticle(language)}
              className="focus-visible:ring-focus border-line text-ink hover:border-signal hover:text-signal rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-default disabled:opacity-60"
              aria-pressed={targetLanguage === language}
            >
              {language === "hi" ? "हिंदी" : "English"}
            </button>
          ))}
          {isLoading && <LoaderCircle className="text-signal h-4 w-4 animate-spin" aria-label="Translating" />}
        </div>
      </div>
      {error && (
        <p className="border-signal bg-soft text-ink mb-5 rounded-lg border-l-2 p-3 text-sm" role="alert">
          {error}
        </p>
      )}
      <h1 className="article-title editorial mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {stripCmsHtml(translated.title) || "Untitled story"}
      </h1>
      <SanitizedHtml html={translated.excerpt} className="text-muted mt-5 max-w-3xl text-lg leading-relaxed" />
      {metadata}
      <div className="border-signal bg-soft mb-8 rounded-xl border-l-2 p-5 dark:bg-gray-900">
        <p className="text-signal text-xs font-bold tracking-widest">{inBriefLabel}</p>
        <SanitizedHtml html={translated.excerpt} className="text-ink mt-2 text-sm leading-relaxed" />
      </div>
      <SanitizedHtml html={translated.content || translated.excerpt} className="prose-readable text-ink" />
    </>
  );
}
