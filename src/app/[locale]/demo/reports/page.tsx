import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDemoUsage } from '@/lib/demo-limits';
import ReportsClient from '@/components/demo/ReportsClient';
import AuthProvider from '@/components/providers/AuthProvider';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ReportsPage({
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

  // Fetch patient with tests
  const patient = await prisma.demoPatient.findFirst({
    where: {
      id: usage.patientId,
      created_by: session.user.id,
    },
    include: {
      tests: {
        orderBy: { created_at: 'desc' },
      },
    },
  });

  if (!patient) {
    redirect(`/${validLocale}/demo/patient/new`);
  }

  const typedPatient = {
    ...patient,
    tests: patient.tests.map((test) => ({
      ...test,
      status: test.status as 'Pending' | 'InProgress' | 'Completed' | 'Cancelled',
      results: test.results as Record<string, unknown> | null,
    })),
  };

  return (
    <AuthProvider>
      <ReportsClient
        patient={typedPatient}
        locale={validLocale}
      />
    </AuthProvider>
  );
}
