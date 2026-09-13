// src/widgets/media/ui/persistent-video-player.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, X, Maximize2, Minimize2, GripHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";

// --- Types ---
export interface VideoData {
  id: string;
  url: string;
  title: string;
  category: string;
}

interface PersistentVideoPlayerProps {
  video: VideoData | null;
  onClose?: () => void;
  initialIsPip?: boolean;
}

// --- Components ---
export const PersistentVideoPlayer: React.FC<PersistentVideoPlayerProps> = ({
  video,
  onClose = () => undefined,
  initialIsPip = true,
}) => {
  const t = useTranslations("videoPlayer");
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragControls = useDragControls();

  const [isPip, setIsPip] = useState(initialIsPip);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle Mute/Unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update Progress Bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      // Prevent NaN if duration is 0
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  // Auto-play when video source changes
  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Autoplay prevented:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [video]);

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag={isPip}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.1}
        role="region"
        aria-label={t("live", { fallback: "Live Video Player" })}
        /* FIXED: Updated Tailwind v4 classes (z-100, md:w-200) */
        className={`fixed z-100 overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl transition-all duration-300 ${
          isPip
            ? "right-6 bottom-6 aspect-video w-80 md:w-96"
            : "right-0 bottom-0 h-full w-full rounded-none md:right-10 md:bottom-10 md:h-auto md:w-200 md:max-w-[90vw] md:rounded-2xl"
        }`}
      >
        {/* Drag Handle & Top Controls */}
        <div
          /* FIXED: Updated Tailwind v4 class (bg-linear-to-b) */
          className={`absolute top-0 left-0 z-20 flex w-full items-center justify-between bg-linear-to-b from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 focus-within:opacity-100 hover:opacity-100 ${
            isPip ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onPointerDown={(e) => {
            if (isPip) dragControls.start(e);
          }}
        >
          <div className="flex items-center gap-2">
            {isPip && <GripHorizontal className="h-5 w-5 text-white/70" aria-hidden="true" />}
            <span className="rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
              {t("live", { fallback: "Live" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPip(!isPip)}
              className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label={isPip ? t("maximize", { fallback: "Maximize" }) : t("minimize", { fallback: "Minimize" })}
            >
              {isPip ? (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              aria-label={t("close", { fallback: "Close video" })}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={video.url}
          className="h-full w-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          playsInline
          muted={isMuted}
          aria-label={video.title}
        />

        {/* Bottom Controls Overlay */}
        {/* FIXED: Updated Tailwind v4 class (bg-linear-to-t) */}
        <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-4">
          {!isPip && (
            <div className="mb-4">
              <span className="mb-1 block text-sm font-semibold tracking-wider text-blue-400 uppercase">
                {video.category}
              </span>
              <h3 className="line-clamp-2 font-serif text-xl font-bold text-white md:text-2xl">
                <SanitizedHtml as="span" html={video.title} />
              </h3>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="rounded-full p-1 text-white transition-colors hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label={isPlaying ? t("pause", { fallback: "Pause" }) : t("play", { fallback: "Play" })}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" aria-hidden="true" />
              ) : (
                <Play className="h-6 w-6 fill-current" aria-hidden="true" />
              )}
            </button>

            {/* AAA Accessibility: Progress Bar */}
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Video progress"
              className="h-1.5 grow overflow-hidden rounded-full bg-white/20"
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={toggleMute}
              className="rounded-full p-1 text-white transition-colors hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label={isMuted ? t("unmute", { fallback: "Unmute" }) : t("mute", { fallback: "Mute" })}
              aria-pressed={isMuted}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
