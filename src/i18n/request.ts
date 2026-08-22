import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && routing.locales.includes(value as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // Validate if the requested locale is supported
  if (!isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // FIX: Updated path to look inside src/messages
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
