// src/widgets/news-feed/ui/opinion-editorial-widget.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { Avatar } from "@/shared/ui/legacy-primitives";

interface OpinionEditorialWidgetProps {
  sectionTitle?: string;
  // FIXED: Replaced local OpinionArticleNode with strict global Article type
  articles?: Article[]; 
}

export const OpinionEditorialWidget: React.FC<OpinionEditorialWidgetProps> = ({ 
  sectionTitle, 
  articles = [] 
}) => {
  const t = useTranslations("opinionWidget");
  const title = sectionTitle || t("defaultTitle", { fallback: "Opinion & Analysis" });

  // Safe array check
  const safeArticles = Array.isArray(articles) ? articles : [];

  if (safeArticles.length === 0) return null;

  return (
    <section 
      className="w-full border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50"
      aria-labelledby="opinion-section-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between border-b-2 border-slate-900 pb-4 dark:border-slate-100">
          <h2 
            id="opinion-section-heading"
            className="font-serif text-3xl font-black tracking-tight text-slate-900 uppercase md:text-4xl dark:text-white"
          >
            {title}
          </h2>
          <Link
            href="/opinion"
            className="group flex items-center text-sm font-bold tracking-wider text-blue-600 uppercase transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            aria-label={`View all ${title} articles`}
          >
            {t("viewAll", { fallback: "View All" })}
            <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-12"
          role="feed"
          aria-label={title}
        >
          {safeArticles.slice(0, 3).map((article, index) => {
            const authorName = article.author || "DailySamachar Desk";

            return (
              <motion.article
                key={article.id || `opinion-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex h-full flex-col"
              >
                <Link 
                  href={`/news/${article.slug}`} 
                  className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 rounded-lg"
                >
                  <span className="sr-only">Read opinion piece: {article.title}</span>
                </Link>

                {/* Author Info & Avatar */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 transition-colors duration-300 group-hover:border-blue-500 md:h-20 md:w-20 dark:border-slate-700 bg-white dark:bg-slate-800">
                    {/* FIXED: Using the Avatar primitive for consistent fallback handling */}
                    <Avatar name={authorName} size="lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                      {authorName}
                    </span>
                    <span className="text-sm font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
                      {/* Fallback to 'Columnist' if role is not available in standard Article type */}
                      Columnist
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="relative flex grow flex-col">
                  <Quote className="absolute -top-2 -left-2 -z-10 h-8 w-8 -scale-x-100 transform text-slate-200 dark:text-slate-800" aria-hidden="true" />
                  <h3 className="mb-3 font-serif text-xl leading-tight font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 md:text-2xl dark:text-white dark:group-hover:text-blue-400">
                    <SanitizedHtml as="span" html={article.title} />
                  </h3>
                  {article.excerpt && (
                    <p className="line-clamp-4 font-serif text-base text-slate-600 italic dark:text-slate-400">
                      <SanitizedHtml as="span" html={article.excerpt} />
                    </p>
                  )}
                </div>

                {/* Read More Indicator */}
                <div 
                  className="mt-6 flex items-center border-t border-slate-200 pt-4 text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:border-slate-800 dark:text-white dark:group-hover:text-blue-400"
                  aria-hidden="true"
                >
                  {t("readArticle", { fallback: "Read Full Analysis" })}
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};