// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { AppProviders } from "../providers";
import { DraftBanner } from "@/components/draft-banner"; // <-- YEH IMPORT KAREIN
import "../globals.css";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DailySamachar.org",
  description: "Verified, independent news from India and around the world.",
  icons: {
    icon: "/Logo.svg",
    apple: "/Logo.svg",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ur" || locale === "ar" ? "rtl" : "ltr"}
      className={`${roboto.variable} ${notoSansDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground selection:bg-brand-accent dark:bg-ink flex min-h-screen flex-col font-sans antialiased selection:text-white dark:text-gray-100">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <a
              href="#main-content"
              className="focus:bg-brand-primary focus:ring-brand-accent sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-white focus:ring-4 focus:outline-none"
            >
              Skip to main content
            </a>
            
            <SiteHeader />
            
            <main id="main-content" className="w-full flex-1" role="main">
              {children}
            </main>
            
            <SiteFooter />
            
            {/* ADDED: Draft Banner ko footer ke neeche add karein */}
            <DraftBanner />
            
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}