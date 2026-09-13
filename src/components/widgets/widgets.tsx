// src/components/widgets/widgets.tsx
"use client";

import { ArrowUp, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getLocalizedPath } from "@/i18n/path";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setProgress(Math.min(100, (window.scrollY / scrollHeight) * 100));
    };

    window.addEventListener("scroll", update, { passive: true });
    update(); // Initial check

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <progress
      aria-label="Reading progress"
      className="[&::-webkit-progress-value]:bg-signal [&::-moz-progress-bar]:bg-signal fixed inset-x-0 top-0 z-60 h-1 w-full appearance-none [&::-webkit-progress-bar]:bg-transparent"
      value={progress}
      max="100"
    />
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="bg-ink hover:bg-signal text-paper focus-visible:ring-signal fixed right-5 bottom-5 z-30 grid h-11 w-11 place-items-center rounded-full shadow-xl transition-colors focus-visible:ring-4 focus-visible:outline-none"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const share = (network: "x" | "facebook" | "linkedin") => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const shareUrl = {
      x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }[network];

    window.open(shareUrl, "share-window", "noopener,noreferrer,width=640,height=560");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div aria-label="Share this story" className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-label="Share on X (Twitter)"
        onClick={() => share("x")}
        className="text-ink hover:text-signal hover:border-signal border-line bg-paper focus-visible:ring-signal rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Twitter size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() => share("facebook")}
        className="text-ink hover:text-signal hover:border-signal border-line bg-paper focus-visible:ring-signal rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Facebook size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() => share("linkedin")}
        className="text-ink hover:text-signal hover:border-signal border-line bg-paper focus-visible:ring-signal rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Linkedin size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Copy link"
        onClick={copyLink}
        className="text-ink hover:text-signal hover:border-signal border-line bg-paper focus-visible:ring-signal rounded-lg border p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Share2 size={16} aria-hidden="true" />
      </button>

      {/* Screen Reader Only Announcement */}
      {copied && (
        <span className="sr-only" role="status">
          Link copied to clipboard
        </span>
      )}
    </div>
  );
}

export function StickySocialBar() {
  return (
    <div className="bg-paper border-line fixed top-1/2 left-4 z-20 hidden -translate-y-1/2 rounded-xl border p-1.5 shadow-sm xl:block">
      <div className="flex flex-col gap-2">
        <ShareButtons />
      </div>
    </div>
  );
}

export function AdPlaceholder({ label = "Advertisement" }: { label?: string }) {
  return (
    <div
      className="bg-soft text-muted border-line flex min-h-30 items-center justify-center rounded-xl border border-dashed px-4 text-[10px] font-bold tracking-[0.18em] uppercase"
      aria-label={label}
    >
      {label}
    </div>
  );
}

export function NewsletterCard() {
  const locale = useLocale();
  return (
    <section
      className="bg-brand-primary rounded-2xl p-6 text-gray-100 shadow-md md:p-8"
      aria-labelledby="newsletter-heading"
    >
      <p className="kicker text-brand-accent">The Daily Brief</p>
      <h3 id="newsletter-heading" className="editorial mt-2 text-2xl font-bold text-white md:text-3xl">
        Make room for better news.
      </h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-gray-300">
        A considered morning read, delivered daily to your inbox.
      </p>
      <Link
        href={getLocalizedPath(locale, "/newsletters")}
        className="bg-brand-accent focus-visible:ring-offset-brand-primary mt-6 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Join the Daily Brief
      </Link>
    </section>
  );
}
