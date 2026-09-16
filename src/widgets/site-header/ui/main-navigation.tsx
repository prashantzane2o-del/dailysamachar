// src/widgets/site-header/ui/main-navigation.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

interface MainNavigationProps {
  links?: Array<{ title: string; href: string }>;
  dropdownLinks?: Array<{ title: string; href: string }>;
}

export function MainNavigation({ links = [], dropdownLinks = [] }: MainNavigationProps) {
  const pathname = usePathname();
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const othersRef = useRef<HTMLLIElement>(null);
  const othersButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const othersMenuId = useId();

  useEffect(() => {
    setIsOthersOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOthersOpen) return;

    requestAnimationFrame(() => menuItemRefs.current[0]?.focus());

    const handlePointerDown = (event: PointerEvent) => {
      if (!othersRef.current?.contains(event.target as Node)) setIsOthersOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOthersOpen(false);
        othersButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOthersOpen]);

  const openOthers = () => setIsOthersOpen(true);

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOthersOpen(false);
      othersButtonRef.current?.focus();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    event.preventDefault();
    const lastIndex = dropdownLinks.length - 1;
    const nextIndex =
      event.key === "Home" ? 0 : event.key === "End" ? lastIndex : index + (event.key === "ArrowDown" ? 1 : -1);
    const wrappedIndex = nextIndex < 0 ? lastIndex : nextIndex > lastIndex ? 0 : nextIndex;
    menuItemRefs.current[wrappedIndex]?.focus();
  };

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
          <li ref={othersRef} className="relative">
            <button
              ref={othersButtonRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={isOthersOpen}
              aria-controls={othersMenuId}
              onClick={() => setIsOthersOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  openOthers();
                }
              }}
              className="focus-visible:ring-signal hover:text-signal flex items-center gap-1 py-2 text-[15px] font-bold tracking-wide text-slate-800 uppercase transition-colors duration-200 outline-none focus-visible:rounded-sm focus-visible:ring-4"
            >
              Others{" "}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${isOthersOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Panel */}
            {isOthersOpen && (
              <div
                id={othersMenuId}
                role="menu"
                aria-label="Other categories"
                className="absolute top-full right-0 z-50 mt-2 flex max-h-[min(70vh,28rem)] w-64 flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 text-slate-900 shadow-xl"
              >
                {dropdownLinks.map((link, index) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      ref={(element) => {
                        menuItemRefs.current[index] = element;
                      }}
                      role="menuitem"
                      onClick={() => setIsOthersOpen(false)}
                      onKeyDown={(event) => handleMenuKeyDown(event, index)}
                      className={`focus-visible:ring-signal focus-visible:bg-soft block px-5 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                        isActive ? "text-signal bg-slate-50" : "hover:text-signal text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
