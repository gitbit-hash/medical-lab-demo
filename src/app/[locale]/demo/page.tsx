import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { authOptions } from '@/lib/auth';
import { getDemoUsage } from '@/lib/demo-limits';
import DemoDashboard from '@/components/demo/DemoDashboard';
import AuthProvider from '@/components/providers/AuthProvider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DemoPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : 'en';
  setRequestLocale(validLocale);

  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect(`/${validLocale}/login`);
  }

  // Get demo usage stats
  const usage = await getDemoUsage(session.user.id);

  return (
    <AuthProvider>
      <DemoDashboard usage={usage} />
    </AuthProvider>
  );
}
