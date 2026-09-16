// src/widgets/news-feed/ui/opinion-editorial-widget.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { stripCmsHtml } from "@/shared/lib/cms-html";
import { Avatar } from "@/shared/ui/legacy-primitives";

interface OpinionEditorialWidgetProps {
  sectionTitle?: string;
  articles?: Article[];
}

// FIXED: Helper function to clean up Author names if WordPress returns an Email ID
function formatAuthorName(name: string): string {
  if (!name) return "DailySamachar Desk";
  if (name.includes("@")) {
    const prefix = name.split("@")[0];
    // Remove numbers/special chars and capitalize the first letter (e.g., dailysamachar56 -> Dailysamachar)
    const cleanedName = prefix.replace(/[0-9_.-]/g, " ").trim();
    return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
  }
  return name;
}

export const OpinionEditorialWidget: React.FC<OpinionEditorialWidgetProps> = ({ sectionTitle, articles = [] }) => {
  const t = useTranslations("opinionWidget");
  const title = sectionTitle || t("defaultTitle", { fallback: "Opinion & Analysis" });

  const safeArticles = Array.isArray(articles) ? articles : [];
  if (safeArticles.length === 0) return null;

  return (
    <section className="border-line bg-soft w-full border-y py-16" aria-labelledby="opinion-section-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-line mb-10 flex items-end justify-between border-b-2 pb-4">
          <h2
            id="opinion-section-heading"
            className="text-ink font-serif text-3xl font-black tracking-tight uppercase md:text-4xl"
          >
            {title}
          </h2>
          <Link
            href="/opinion"
            className="group text-signal hover:text-ink focus-visible:ring-signal flex items-center rounded-sm text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`View all ${title} articles`}
          >
            {t("viewAll", { fallback: "View All" })}
            <ArrowRight
              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-12" role="feed" aria-label={title}>
          {safeArticles.slice(0, 3).map((article, index) => {
            const authorName = formatAuthorName(article.author);

            return (
              <motion.article
                key={article.id || `opinion-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                // FIXED: Added proper Card styling (bg-paper, border, p-6) so text never disappears into the background
                className="group bg-paper border-line relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="focus-visible:ring-signal absolute inset-0 z-10 rounded-2xl focus-visible:ring-4 focus-visible:outline-none"
                >
                  <span className="sr-only">Read opinion piece: {stripCmsHtml(article.title)}</span>
                </Link>

                {/* z-20 and pointer-events-none ensures text sits above the link but doesn't block clicking */}
                <div className="pointer-events-none relative z-20 mb-6 flex items-center gap-4">
                  <div className="border-line group-hover:border-signal bg-soft relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-colors duration-300">
                    <Avatar name={authorName} size="md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-ink font-sans text-lg font-bold capitalize">{authorName}</span>
                    <span className="text-signal mt-0.5 text-xs font-bold tracking-wide uppercase">Columnist</span>
                  </div>
                </div>

                <div className="pointer-events-none relative z-20 flex grow flex-col">
                  <Quote
                    className="text-line absolute -top-4 -left-2 -z-10 h-10 w-10 -scale-x-100 transform opacity-60"
                    aria-hidden="true"
                  />
                  <h3 className="text-ink group-hover:text-signal mb-3 line-clamp-4 font-serif text-xl leading-tight font-bold transition-colors duration-300 md:text-2xl">
                    <SanitizedHtml as="span" html={article.title} />
                  </h3>
                  {article.excerpt && (
                    <SanitizedHtml
                      as="div"
                      html={article.excerpt}
                      className="text-muted line-clamp-3 font-serif text-base italic"
                    />
                  )}
                </div>

                <div
                  className="border-line text-muted group-hover:text-signal pointer-events-none z-20 mt-6 flex items-center border-t pt-4 text-xs font-bold tracking-wider uppercase transition-colors"
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
