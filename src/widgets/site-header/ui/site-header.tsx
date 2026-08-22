import { getTranslations } from "next-intl/server";
import { cmsClient } from "@/shared/api/cms";
import { SiteHeaderClient } from "@/widgets/site-header/ui/site-header-client";
import { TopUtilityBar } from "@/widgets/site-header/ui/top-utility-bar";

export async function SiteHeader() {
  const [tHeader, tCommon, categories] = await Promise.all([
    getTranslations("header"),
    getTranslations("common"),
    cmsClient.getCategories().catch((error: unknown) => {
      console.error("Failed to load WordPress categories for navigation", error);
      return [];
    }),
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal focus:px-4 focus:py-3 focus:font-bold focus:text-white focus:ring-2 focus:ring-focus">
        {tHeader("skipToContent")}
      </a>
      <TopUtilityBar />
      <SiteHeaderClient brand={tCommon("brand")} signIn={tHeader("signIn")} subscribe={tHeader("subscribe")} categories={categories} />
    </header>
  );
}
