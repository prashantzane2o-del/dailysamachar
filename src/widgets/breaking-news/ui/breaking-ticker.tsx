"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// --- Types ---
export interface BreakingNewsNode {
  id: string;
  slug: string;
  title: string;
}

interface BreakingTickerProps {
  articles: BreakingNewsNode[];
  displayDuration?: number; // Time in ms before switching to the next headline
}

// --- Dummy Data (Fallback) ---
const DEFAULT_BREAKING: BreakingNewsNode[] = [
  {
    id: "b1",
    slug: "global-markets-rally",
    title: "Global markets experience unprecedented rally following interest rate cuts.",
  },
  { id: "b2", slug: "major-tech-merger", title: "Two leading technology giants announce a $50 billion merger." },
  { id: "b3", slug: "climate-summit-accord", title: "Historic agreement reached at the international climate summit." },
];

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  articles = DEFAULT_BREAKING,
  displayDuration = 5000,
}) => {
  const t = useTranslations("breakingNews");

  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextHeadline = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  }, [articles.length]);

  // Handle automatic cycling
  useEffect(() => {
    if (!isVisible || isPaused || articles.length <= 1) return;

    const timer = setInterval(nextHeadline, displayDuration);
    return () => clearInterval(timer);
  }, [isVisible, isPaused, articles.length, displayDuration, nextHeadline]);

  if (!isVisible || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div
      className="relative z-40 w-full border-b border-red-800 bg-red-600 text-white dark:bg-red-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <div className="flex grow items-center overflow-hidden">
            {/* Urgent Label */}
            <div className="mr-4 flex shrink-0 items-center gap-1.5 md:mr-6">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              <span className="hidden text-xs font-black tracking-widest uppercase sm:inline-block md:text-sm">
                {t("breaking", { fallback: "Breaking" })}
              </span>
            </div>

            {/* Animated Headline */}
            <div className="relative flex h-full grow items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentArticle.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex w-full items-center"
                >
                  <Link
                    href={`/news/${currentArticle.slug}`}
                    className="flex w-full items-center truncate rounded-sm text-sm font-medium hover:underline focus:ring-2 focus:ring-white focus:outline-none md:text-base"
                    title={currentArticle.title}
                  >
                    <span className="truncate">{currentArticle.title}</span>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="ml-4 flex shrink-0 items-center gap-3">
            {/* Progress Indicator (dots) */}
            <div className="mr-4 hidden items-center gap-1.5 lg:flex">
              {articles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-all focus:outline-none ${
                    idx === currentIndex ? "scale-125 bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={t("goToHeadline", { number: idx + 1, fallback: `Go to headline ${idx + 1}` })}
                />
              ))}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="rounded p-1 transition-colors hover:bg-red-700 focus:ring-2 focus:ring-white focus:outline-none dark:hover:bg-red-800"
              aria-label={t("dismiss", { fallback: "Dismiss breaking news" })}
            >
              <X className="h-5 w-5 opacity-80 hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
