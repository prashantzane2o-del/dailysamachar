// src/widgets/site-header/ui/mobile-menu-trigger.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function MobileMenuTrigger({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Auto-close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 2. Close the mobile menu and release the scroll lock when switching to desktop.
  useEffect(() => {
    const handleResize = () => {
      // Changed to 1024px (lg breakpoint) as it aligns better with desktop menus
      if (window.innerWidth >= 1024) { 
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Prevent body scroll when menu is open (Prevents background scrolling)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 4. AAA Accessibility: Close menu on 'Escape' key press
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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-ink hover:text-brand-accent flex items-center justify-center rounded-md p-2 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      {/* Dropdown / Overlay Menu */}
      {isOpen && (
        <div 
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          /* FIXED: Replaced non-standard z-99 with standard z-50 and added max-height for scrolling */
          className="absolute top-full left-0 z-50 w-full h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-200 bg-white px-4 py-6 shadow-xl dark:border-gray-800 dark:bg-gray-950"
        >
          <nav className="flex flex-col gap-4">
            {/* Render navigation links passed as children */}
            {children}
          </nav>
        </div>
      )}
    </div>
  );
}