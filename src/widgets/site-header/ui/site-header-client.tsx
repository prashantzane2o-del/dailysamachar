"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { SearchTrigger } from "./search-trigger";

const sectionLinks = [{ key: "india", href: "/category/india" }, { key: "world", href: "/category/world" }, { key: "business", href: "/category/business" }, { key: "technology", href: "/category/technology" }, { key: "sports", href: "/category/sports" }] as const;

export function SiteHeaderClient({ brand, signIn, subscribe }: { brand: string; signIn: string; subscribe: string }) {
  const tHeader = useTranslations("header");
  const tNavigation = useTranslations("navigation");
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const menuId = useId();
  useMotionValueEvent(scrollY, "change", (value) => setCompact(value > 32));
  useEffect(() => { if (!sectionsOpen) return; const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSectionsOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [sectionsOpen]);

  return <motion.div animate={{ paddingTop: compact ? 8 : 16, paddingBottom: compact ? 8 : 16 }} transition={{ duration: 0.2, ease: "easeOut" }} className="border-b border-line"><div className="container-page flex items-center justify-between gap-4"><div className="flex items-center gap-2 md:w-1/3 md:gap-4"><MobileMenuTrigger /><SearchTrigger /></div><Link href="/" className="group flex shrink-0 items-center rounded-sm focus-visible:ring-2 focus-visible:ring-focus" aria-label={brand}><span className="editorial text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-ink">{brand}<span className="text-signal transition-colors group-hover:text-ink">.</span></span></Link><div className="flex items-center justify-end gap-2 md:w-1/3 md:gap-4"><div className="relative"><button type="button" aria-expanded={sectionsOpen} aria-controls={menuId} onClick={() => setSectionsOpen((open) => !open)} className="hidden items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-ink transition-colors hover:bg-soft hover:text-signal focus-visible:ring-2 focus-visible:ring-focus lg:inline-flex">{tHeader("sections") || "Sections"}<ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button><AnimatePresence>{sectionsOpen && <motion.div id={menuId} role="menu" aria-label={tHeader("sections") || "Sections"} initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute right-0 top-full mt-3 w-52 rounded-xl border border-line bg-paper p-2 shadow-xl">{sectionLinks.map((section) => <Link key={section.key} href={section.href} role="menuitem" onClick={() => setSectionsOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-soft hover:text-signal focus-visible:ring-2 focus-visible:ring-focus">{tNavigation(section.key)}</Link>)}</motion.div>}</AnimatePresence></div><ThemeToggle /><LanguageSwitcher /><Link href="/login" className="hidden rounded-md px-2 py-2 text-sm font-bold text-ink hover:text-signal focus-visible:ring-2 focus-visible:ring-focus lg:block">{signIn}</Link><Link href="/subscribe" className="hidden rounded-full bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-paper transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-focus md:block">{subscribe}</Link></div></div></motion.div>;
}
