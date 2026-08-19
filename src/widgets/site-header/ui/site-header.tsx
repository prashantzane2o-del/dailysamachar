import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { TopUtilityBar } from "./top-utility-bar";
import { MainNavigation } from "./main-navigation";
import { SiteHeaderClient } from "./site-header-client";

export function SiteHeader() {
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");

  return <header className="sticky top-0 z-50 w-full border-b border-line glass"><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal focus:px-4 focus:py-3 focus:font-bold focus:text-white focus:ring-2 focus:ring-focus">{tHeader("skipToContent") || "Skip to main content"}</a><TopUtilityBar /><SiteHeaderClient brand={tCommon("brand")} signIn={tHeader("signIn") || "Sign In"} subscribe={tHeader("subscribe") || "Subscribe"} /><MainNavigation /></header>;
}
