"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function MainNavigation() {
  const tNav = useTranslations("navigation");
  const pathname = usePathname();

  // Navigation Links localized securely via next-intl
  const navLinks = [
    { label: tNav("india"), href: "/category/india" },
    { label: tNav("world"), href: "/category/world" },
    { label: tNav("politics"), href: "/category/politics" },
    { label: tNav("business"), href: "/category/business" },
    { label: tNav("technology"), href: "/category/technology" },
    { label: tNav("sports"), href: "/category/sports" },
    { label: tNav("opinion"), href: "/category/opinion" },
  ];

  return (
    <nav
      aria-label={tNav("mainNavigation") || "Main Navigation"}
      className="hidden border-b border-line bg-paper shadow-sm md:block"
    >
      <ul className="container-page flex items-center justify-center gap-8 py-3">
        {navLinks.map((link) => {
          // Check if the current route matches the link href or starts with it (for nested pages)
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.label}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-sm text-[13px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4 ${
                  isActive
                    ? "border-b-2 border-signal pb-0.5 text-signal" // Visual indicator for active state
                    : "pb-1.5 text-ink/80 hover:text-signal" // FIXED: Replaced pb-[6px] with pb-1.5
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}