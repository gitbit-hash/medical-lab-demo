import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { locales, localeDirections, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const metadata = messages.Metadata as { title: string; description: string } | undefined;
  return {
    title: metadata?.title || 'MedicaLab - Medical Laboratory Management System',
    description: metadata?.description || 'Streamline your laboratory operations.',
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : 'en';
  setRequestLocale(validLocale);
  const messages = await getMessages();
  const dir = localeDirections[validLocale];

  return (
    <html lang={validLocale} dir={dir} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={validLocale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
