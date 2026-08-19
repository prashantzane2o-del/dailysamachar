"use client";

import { ChangeEvent, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    
    startTransition(() => {
      // Replace the current route with the new locale
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative flex items-center">
      {/* 1. Visually hidden label for Screen Readers (WCAG 2.2 AA) */}
      <label htmlFor="language-switcher" className="sr-only">
        {tCommon("changeLanguage") || "Change language"}
      </label>
      
      <Globe 
        className="pointer-events-none absolute left-2 h-4 w-4 text-muted" 
        aria-hidden="true" 
      />
      
      {/* 2. Native select for maximum accessibility and mobile ease-of-use */}
      <select
        id="language-switcher"
        value={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="h-9 cursor-pointer appearance-none rounded-sm bg-transparent pl-7 pr-4 text-sm font-bold text-ink uppercase tracking-wide transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* Note: Update these options based on your supported routing.locales */}
        <option value="en" className="text-ink bg-paper">EN</option>
        <option value="hi" className="text-ink bg-paper">HI</option>
      </select>
    </div>
  );
}