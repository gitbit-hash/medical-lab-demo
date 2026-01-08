// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isValidLocale(locale)) {
    locale = defaultLocale;
  }

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return { locale, messages };
  } catch (error) {
    console.error(`Failed to load messages for ${locale}:`, error);
    try {
      const fallbackMessages = (await import(`../../messages/${defaultLocale}.json`)).default;
      return { locale: defaultLocale, messages: fallbackMessages };
    } catch (fallbackError) {
      return { locale: defaultLocale, messages: {} };
    }
  }
});
