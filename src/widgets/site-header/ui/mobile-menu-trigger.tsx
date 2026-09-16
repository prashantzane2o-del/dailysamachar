// src/widgets/site-header/ui/mobile-menu-trigger.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/i18n/ui/language-switcher";

interface MobileMenuTriggerProps {
  links?: Array<{ title: string; href: string }>;
  dropdownLinks?: Array<{ title: string; href: string }>;
}

export function MobileMenuTrigger({ links = [], dropdownLinks = [] }: MobileMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-signal focus-visible:ring-signal flex h-10 w-10 items-center justify-center rounded-xl text-slate-900 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="absolute top-full left-0 z-50 h-[calc(100vh-4rem)] w-full overflow-y-auto border-b border-slate-200 bg-white px-4 py-6 text-slate-900 shadow-xl dark:border-slate-200 dark:bg-white dark:text-slate-900"
        >
          <nav className="flex flex-col gap-2">
            {links.map((nav) => (
              <Link
                key={nav.title}
                href={nav.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-signal block rounded-xl px-4 py-3 text-lg font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {nav.title}
              </Link>
            ))}

            {/* FIXED: Grouped Overflow Categories clearly in the mobile menu */}
            {dropdownLinks.length > 0 && (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="mb-2 px-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Others</p>
                <div className="flex flex-col gap-1">
                  {dropdownLinks.map((nav) => (
                    <Link
                      key={nav.title}
                      href={nav.href}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-signal block rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {nav.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 border-t border-slate-200 px-4 pt-4">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
