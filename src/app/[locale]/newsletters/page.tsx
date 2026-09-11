import { getTranslations, setRequestLocale } from "next-intl/server";
import { StaticPage } from "@/features/home/components/static-page";
import { Link } from "@/i18n/routing";

export default async function NewslettersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "newsletter" });

  return (
    <main>
      <StaticPage eyebrow={t("subscribeTitle")} title={t("subscribeTitle")}>
        <p>{t("subscribeDescription")}</p>
        <Link
          href="/signup"
          className="bg-ink text-paper hover:bg-signal focus-visible:ring-focus inline-flex rounded-lg px-5 py-3 text-sm font-bold focus-visible:ring-2 dark:bg-gray-100 dark:text-gray-900"
        >
          {t("subscribeButton")}
        </Link>
      </StaticPage>
    </main>
  );
}
