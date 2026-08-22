import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { BreakingTicker } from "@/widgets/breaking-news";
import { MainLayout } from "@/components/layout/main-layout";

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
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Fetch translations for the client side
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider defaultTheme="light">
        <QueryProvider>
          <MainLayout
            utility={<BreakingTicker />}
            header={<SiteHeader />}
            footer={<SiteFooter />}
          >
            {children}
          </MainLayout>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
