import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDemoUsage } from '@/lib/demo-limits';
import PatientDetailsClient from '@/components/demo/PatientDetailsClient';
import AuthProvider from '@/components/providers/AuthProvider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PatientDetailsPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : 'en';
  setRequestLocale(validLocale);

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${validLocale}/login`);
  }

  // Fetch the patient
  const patient = await prisma.demoPatient.findFirst({
    where: {
      id,
      created_by: session.user.id,
    },
    include: {
      tests: {
        orderBy: { created_at: 'desc' },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  // Get demo usage stats
  const usage = await getDemoUsage(session.user.id);

  return (
    <AuthProvider>
      <PatientDetailsClient
        patient={patient}
        usage={usage}
        locale={validLocale}
      />
    </AuthProvider>
  );
}
