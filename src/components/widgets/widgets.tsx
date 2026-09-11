"use client";
import { ArrowUp, CloudSun, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getLocalizedPath } from "@/i18n/path";

export function LanguageSwitcher() {
  return (
    <select aria-label="Language" className="bg-transparent text-xs font-bold outline-none">
      <option>English</option>
      <option>हिंदी</option>
      <option>বাংলা</option>
    </select>
  );
}
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () =>
      setProgress(Math.min(100, (scrollY / Math.max(1, document.body.scrollHeight - innerHeight)) * 100));
    addEventListener("scroll", update, { passive: true });
    update();
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <progress
      aria-label="Reading progress"
      className="[&::-webkit-progress-value]:bg-signal [&::-moz-progress-bar]:bg-signal fixed inset-x-0 top-0 z-60 h-0.5 w-full appearance-none [&::-webkit-progress-bar]:bg-transparent"
      value={progress}
      max="100"
    />
  );
}
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(scrollY > 600);
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return visible ? (
    <button
      aria-label="Back to top"
      onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      className="bg-ink hover:bg-signal fixed right-5 bottom-5 z-30 grid h-10 w-10 place-items-center rounded-full text-white shadow-xl"
    >
      <ArrowUp size={18} />
    </button>
  ) : null;
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
    <div aria-label="Share this story" className="flex gap-2">
      <button
        type="button"
        aria-label="Share on X"
        onClick={() => share("x")}
        className="hover:text-signal rounded-lg border p-2"
      >
        <Twitter size={15} />
      </button>
      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() => share("facebook")}
        className="hover:text-signal rounded-lg border p-2"
      >
        <Facebook size={15} />
      </button>
      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() => share("linkedin")}
        className="hover:text-signal rounded-lg border p-2"
      >
        <Linkedin size={15} />
      </button>
      <button
        type="button"
        aria-label="Copy link"
        onClick={copyLink}
        className="hover:text-signal rounded-lg border p-2"
      >
        <Share2 size={15} />
      </button>
      {copied && (
        <span className="sr-only" role="status">
          Link copied
        </span>
      )}
    </div>
  );
}
export function StickySocialBar() {
  return (
    <div className="bg-paper fixed top-1/2 left-4 z-20 hidden -translate-y-1/2 rounded-xl border p-1 shadow-sm xl:block">
      <ShareButtons />
    </div>
  );
}
export function AdPlaceholder({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="bg-soft text-muted grid min-h-28 place-items-center rounded-xl border border-dashed px-4 text-[10px] font-bold tracking-[.18em] uppercase">
      {label}
    </div>
  );
}
export function NewsletterCard() {
  const locale = useLocale();

  return (
    <div className="bg-ink rounded-2xl p-6 text-white">
      <p className="kicker text-red-400">The Daily Brief</p>
      <h3 className="editorial mt-2 text-2xl font-bold">Make room for better news.</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">A considered morning read, delivered daily.</p>
      <Link
        href={getLocalizedPath(locale, "/newsletters")}
        className="bg-signal mt-5 inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Join the Daily Brief
      </Link>
    </div>
  );
}
export function WeatherWidget() {
  return (
    <div className="rounded-xl border p-4">
      <CloudSun className="text-signal" />
      <p className="text-muted mt-3 text-xs font-bold">NEW DELHI</p>
      <p className="editorial text-3xl font-bold">29°</p>
      <p className="text-muted text-xs">Hazy sunshine · Feels like 31°</p>
    </div>
  );
}
export function StockWidget() {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-muted text-xs font-bold">MARKETS</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="font-bold">NIFTY 50</p>
          <p className="text-muted text-xs">24,869.25</p>
        </div>
        <span className="text-xs font-bold text-emerald-600">+0.62%</span>
      </div>
    </div>
  );
}
