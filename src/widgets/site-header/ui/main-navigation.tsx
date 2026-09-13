// src/widgets/site-header/ui/main-navigation.tsx
"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

interface MainNavigationProps {
  links?: Array<{ title: string; href: string }>;
  dropdownLinks?: Array<{ title: string; href: string }>;
}

export function MainNavigation({ links = [], dropdownLinks = [] }: MainNavigationProps) {
  const pathname = usePathname();

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Main Navigation">
      <ul className="flex items-center gap-x-5 lg:gap-x-7">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));

          return (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`focus-visible:ring-signal relative block py-2 text-[15px] font-bold tracking-wide whitespace-nowrap uppercase transition-colors duration-200 outline-none focus-visible:rounded-sm focus-visible:ring-4 ${
                  isActive
                    ? "text-signal border-signal border-b-2"
                    : "hover:text-signal border-b-2 border-transparent text-slate-800"
                } `}
                aria-current={isActive ? "page" : undefined}
              >
                {link.title}
              </Link>
            </li>
          );
        })}

        {/* FIXED: Dropdown for Overflow Categories */}
        {dropdownLinks.length > 0 && (
          <li className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="focus-visible:ring-signal group-hover:text-signal flex items-center gap-1 py-2 text-[15px] font-bold tracking-wide text-slate-800 uppercase transition-colors duration-200 outline-none focus-visible:rounded-sm focus-visible:ring-4"
            >
              More{" "}
              <ChevronDown
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Panel */}
            <div className="absolute top-full right-0 mt-1 hidden w-56 flex-col rounded-xl border border-slate-200 bg-white py-2 shadow-xl group-hover:flex">
              {dropdownLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className={`focus-visible:text-signal block px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:bg-slate-50 focus-visible:outline-none ${
                      isActive ? "text-signal bg-slate-50" : "hover:text-signal text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}
