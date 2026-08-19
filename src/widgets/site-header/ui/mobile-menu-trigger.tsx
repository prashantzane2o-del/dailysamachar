"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function MobileMenuTrigger() {
  const tHeader = useTranslations("header");
  
  // Ye state aage chalkar actual Mobile Drawer component ko open karne ke liye use hogi
  // (e.g., Zustand, Zustand, Context ya URL search params ke through sync karke)
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    // TODO: Add logic to sync this state with the actual `<MobileMenuDrawer />`
  };

  return (
    <button
      type="button"
      onClick={toggleMenu}
      aria-expanded={isOpen}
      aria-controls="mobile-menu-drawer"
      aria-label={isOpen ? tHeader("closeMenu") || "Close menu" : tHeader("openMenu") || "Open menu"}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 md:hidden"
    >
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}