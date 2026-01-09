import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { authOptions } from '@/lib/auth';
import { getDemoUsage } from '@/lib/demo-limits';
import NewPatientClient from '@/components/demo/NewPatientClient';
import AuthProvider from '@/components/providers/AuthProvider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function NewPatientPage({
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

  // Check if user already has a patient
  const usage = await getDemoUsage(session.user.id);

  if (!usage.canCreatePatient) {
    // Already has a patient, redirect to their patient page
    redirect(`/${validLocale}/demo/patient/${usage.patientId}`);
  }

  return (
    <AuthProvider>
      <NewPatientClient locale={validLocale} />
    </AuthProvider>
  );
}
