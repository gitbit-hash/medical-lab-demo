import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { authOptions } from '@/lib/auth';
import { getDemoUsage } from '@/lib/demo-limits';
import SelectTestsClient from '@/components/demo/SelectTestsClient';
import AuthProvider from '@/components/providers/AuthProvider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SelectTestsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : 'en';
  setRequestLocale(validLocale);

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${validLocale}/login`);
  }

  // Get demo usage stats
  const usage = await getDemoUsage(session.user.id);

  // If no patient exists, redirect to create one
  if (!usage.patientId) {
    redirect(`/${validLocale}/demo/patient/new`);
  }

  // If no tests remaining, redirect back to patient
  if (!usage.canCreateTest) {
    redirect(`/${validLocale}/demo/patient/${usage.patientId}`);
  }

  return (
    <AuthProvider>
      <SelectTestsClient
        patientId={usage.patientId}
        testsRemaining={usage.testsRemaining}
        locale={validLocale}
      />
    </AuthProvider>
  );
}
