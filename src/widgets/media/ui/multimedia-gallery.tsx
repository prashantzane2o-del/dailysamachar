// src/widgets/media/ui/multimedia-gallery.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlayCircle, Camera, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";

interface MultimediaGalleryProps {
  sectionTitle?: string;
  articles?: Article[];
}

// Helper to determine media type from Article data
function getMediaType(article: Article): "video" | "gallery" {
  const cat = article.category?.toLowerCase() || "";
  if (cat.includes("video") || article.tags?.some((t) => t.toLowerCase() === "video")) {
    return "video";
  }
  return "gallery";
}

const MediaIndicator: React.FC<{ article: Article; type: "video" | "gallery" }> = ({ article, type }) => {
  if (type === "video") {
    return (
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-white shadow-sm backdrop-blur-md">
        <PlayCircle className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-bold tracking-wider uppercase">
          {article.readTime ? `${article.readTime} Min` : "Video"}
        </span>
      </div>
    );
  }
  return (
    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-white shadow-sm backdrop-blur-md">
      <Camera className="h-4 w-4" aria-hidden="true" />
      <span className="text-xs font-bold tracking-wider uppercase">Gallery</span>
    </div>
  );
};

export const MultimediaGallery: React.FC<MultimediaGalleryProps> = ({ sectionTitle, articles = [] }) => {
  const t = useTranslations("multimedia");
  const title = sectionTitle || t("inFocus", { fallback: "In Focus: Photos & Videos" });

  const safeArticles = Array.isArray(articles) ? articles : [];
  if (safeArticles.length === 0) return null;

  const featuredItem = safeArticles[0];
  const gridItems = safeArticles.slice(1, 5);

  return (
    <section
      className="w-full border-y border-gray-900 bg-gray-950 py-16 text-white"
      aria-labelledby="multimedia-section-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2
            id="multimedia-section-heading"
            className="font-serif text-3xl font-black tracking-tight uppercase md:text-4xl"
          >
            {title}
          </h2>
          <Link
            href="/gallery"
            className="group flex items-center rounded-sm text-sm font-bold tracking-wider text-gray-300 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label={`View all ${title}`}
          >
            {t("viewAll", { fallback: "View All Media" })}
            <ArrowRight
              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12" role="list">
          {/* Featured Large Item */}
          <motion.div
            role="listitem"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            /* FIXED: Replaced lg:aspect-auto with lg:aspect-video to prevent Next Image 0 height warning */
            className="group relative aspect-4/3 overflow-hidden rounded-xl lg:col-span-8 lg:aspect-video"
          >
            <Link
              href={`/news/${featuredItem.slug}`}
              className="focus-visible:ring-brand-accent absolute inset-0 z-30 rounded-xl focus-visible:ring-4 focus-visible:outline-none"
            >
              <span className="sr-only">Read featured media story: {featuredItem.title}</span>
            </Link>

            {featuredItem.image || featuredItem.imageUrl ? (
              <Image
                src={featuredItem.image || featuredItem.imageUrl || ""}
                alt={featuredItem.imageAlt || featuredItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="bg-black object-contain transition-transform duration-700 ease-out sm:object-cover sm:group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                <ImageIcon className="h-12 w-12 opacity-50" aria-hidden="true" />
              </div>
            )}

            <div
              className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/30 to-transparent"
              aria-hidden="true"
            />

            <MediaIndicator article={featuredItem} type={getMediaType(featuredItem)} />

            {getMediaType(featuredItem) === "video" && (
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                <div className="bg-brand-primary/90 scale-90 transform rounded-full p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full p-6 md:p-8">
              <h3 className="group-hover:text-brand-accent font-serif text-2xl leading-tight font-bold transition-colors md:text-4xl">
                <SanitizedHtml as="span" html={featuredItem.title} />
              </h3>
            </div>
          </motion.div>

          {/* 2x2 Grid for smaller items */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-4 lg:grid-cols-1">
            {gridItems.map((item, index) => (
              <motion.div
                key={item.id || `media-${index}`}
                role="listitem"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                /* FIXED: Removed lg:aspect-auto to safely rely on lg:h-[calc(50%-12px)] explicit height */
                className="group relative aspect-square overflow-hidden rounded-xl sm:aspect-video lg:h-[calc(50%-12px)]"
              >
                <Link
                  href={`/news/${item.slug}`}
                  className="focus-visible:ring-brand-accent absolute inset-0 z-30 rounded-xl focus-visible:ring-4 focus-visible:outline-none"
                >
                  <span className="sr-only">Read media story: {item.title}</span>
                </Link>

                {item.image || item.imageUrl ? (
                  <Image
                    src={item.image || item.imageUrl || ""}
                    alt={item.imageAlt || item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="bg-black object-contain transition-transform duration-700 ease-out sm:object-cover sm:group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                    <ImageIcon className="h-8 w-8 opacity-50" aria-hidden="true" />
                  </div>
                )}

                <div
                  className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/20 to-transparent"
                  aria-hidden="true"
                />

                <MediaIndicator article={item} type={getMediaType(item)} />

                <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full p-4">
                  <h4 className="group-hover:text-brand-accent line-clamp-3 font-serif text-sm leading-snug font-bold transition-colors md:text-lg">
                    <SanitizedHtml as="span" html={item.title} />
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
