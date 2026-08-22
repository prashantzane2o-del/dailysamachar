"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileMenuTriggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenuTrigger({ open, onOpenChange }: MobileMenuTriggerProps) {
  const t = useTranslations("header");

  return (
    <button type="button" onClick={() => onOpenChange(!open)} aria-expanded={open} aria-controls="mobile-menu-drawer" aria-label={open ? t("closeMenu") : t("openMenu")} className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-focus md:hidden dark:text-gray-100 dark:hover:bg-gray-800">
      {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
    </button>
  );
}
