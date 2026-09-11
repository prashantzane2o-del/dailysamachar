"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Bookmark, BookmarkCheck, Volume2, VolumeX, MessageSquare, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";
import { BOOKMARKS_STORAGE_KEY, parseBookmarks, type StoredBookmark } from "@/shared/types/bookmark";

// --- Types ---
interface ReadingToolbarProps {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  category: string;
  commentCount?: number;
}

// --- Components ---

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  articleId,
  articleSlug,
  articleTitle,
  category,
  commentCount = 0,
}) => {
  const t = useTranslations("articleToolbar");

  const [isVisible, setIsVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarks, setBookmarks] = useLocalStorage<StoredBookmark[]>(BOOKMARKS_STORAGE_KEY, [], {
    deserializer: parseBookmarks,
  });
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === articleId);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Scroll listener for visibility and progress bar
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const totalScrollable = documentHeight - windowHeight;
      const progress = totalScrollable > 0 ? (scrollPosition / totalScrollable) * 100 : 0;

      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Show toolbar after scrolling past initial hero section (approx 400px)
      setIsVisible(scrollPosition > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleBookmark = () => {
    setBookmarks((current) => {
      if (current.some((bookmark) => bookmark.id === articleId)) {
        return current.filter((bookmark) => bookmark.id !== articleId);
      }

      return [
        ...current,
        { id: articleId, slug: articleSlug, title: articleTitle, category, savedAt: new Date().toISOString() },
      ].slice(-200);
    });
  };

  const toggleAudio = () => {
    // In a real app, this would connect to the Web Speech API or a custom audio player
    setIsPlayingAudio((playing) => !playing);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      window.setTimeout(() => setIsLinkCopied(false), 1800);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Error sharing article", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          data-article-id={articleId}
          className="fixed top-0 left-0 z-40 w-full border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-lg dark:border-gray-800 dark:bg-black/90"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gray-100 dark:bg-gray-900">
            <div
              className="bg-signal h-full transition-all duration-150 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
            {/* Left: Branding / Context */}
            <div className="flex items-center">
              <span className="hidden text-sm font-bold tracking-wider text-gray-900 uppercase sm:block dark:text-white">
                Daily<span className="text-signal">Samachar</span>
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={toggleAudio}
                className="focus:ring-signal flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={
                  isPlayingAudio
                    ? t("pauseAudio", { fallback: "Pause Audio" })
                    : t("playAudio", { fallback: "Listen to Article" })
                }
              >
                {isPlayingAudio ? <VolumeX className="text-signal h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="hidden text-xs font-semibold md:block">
                  {isPlayingAudio ? t("playing", { fallback: "Playing" }) : t("listen", { fallback: "Listen" })}
                </span>
              </button>

              <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />

              <button
                type="button"
                className="focus:ring-signal rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={t("textSize", { fallback: "Adjust Text Size" })}
              >
                <Type className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const commentsSection = document.getElementById("comments-section");
                  commentsSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="focus:ring-signal relative rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={t("jumpToComments", { fallback: "Jump to Comments" })}
              >
                <MessageSquare className="h-4 w-4" />
                {commentCount > 0 && (
                  <span className="bg-signal absolute top-0 right-0 -mt-1 -mr-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                    {commentCount > 99 ? "99+" : commentCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleBookmark}
                aria-pressed={isBookmarked}
                className="focus:ring-signal rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={
                  isBookmarked
                    ? t("removeBookmark", { fallback: "Remove Bookmark" })
                    : t("saveArticle", { fallback: "Save Article" })
                }
              >
                {isBookmarked ? <BookmarkCheck className="text-signal h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="focus:ring-signal rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={t("share", { fallback: "Share Article" })}
              >
                <Share2 className="h-4 w-4" />
              </button>
              {isLinkCopied && (
                <span className="sr-only" role="status">
                  {t("linkCopied", { fallback: "Link copied to clipboard" })}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
