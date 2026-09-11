import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { isSupportedLocale, routing, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  let locale: Locale = routing.defaultLocale;

  if (isSupportedLocale(requestedLocale)) {
    locale = requestedLocale;
  }

  try {
    return {
      locale,
      // Dynamically import the translation dictionaries based on the validated locale
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});
