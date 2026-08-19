import "@/app/globals.css"; // <-- THIS FIXES THE STYLING ISSUE

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { BreakingTicker } from "@/widgets/breaking-news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      template: `%s | ${t("siteName")}`,
      default: `${t("siteName")} - ${t("homeTitle")}`,
    },
    description: t("homeDescription"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Fetch translations for the client side
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased bg-paper text-ink">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="system">
            <QueryProvider>
              {/* Global Breaking News Ticker */}
              <BreakingTicker />
              
              {/* Site Header with Navigation & Utility Bar */}
              <SiteHeader />

              {/* Main Content Area */}
              <div className="flex-1">
                {children}
              </div>

              {/* Global Site Footer */}
              <SiteFooter />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}