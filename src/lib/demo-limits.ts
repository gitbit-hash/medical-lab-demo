import { prisma } from './prisma';

export const DEMO_LIMITS = {
  MAX_PATIENTS: 1,
  MAX_TESTS: 5,
} as const;

export interface DemoUsage {
  canCreatePatient: boolean;
  canCreateTest: boolean;
  patientsUsed: number;
  patientsMax: number;
  testsUsed: number;
  testsMax: number;
  testsRemaining: number;
  patientId: string | null;
}

export async function getDemoUsage(userId: string): Promise<DemoUsage> {
  // Get user's demo patient and tests count
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Get the patient created by this user
  const patient = await prisma.demoPatient.findFirst({
    where: { created_by: userId },
    include: {
      tests: true,
    },
  });

  const patientsUsed = patient ? 1 : 0;
  const testsUsed = patient?.tests.length ?? 0;

  return {
    canCreatePatient: patientsUsed < DEMO_LIMITS.MAX_PATIENTS,
    canCreateTest: testsUsed < DEMO_LIMITS.MAX_TESTS,
    patientsUsed,
    patientsMax: DEMO_LIMITS.MAX_PATIENTS,
    testsUsed,
    testsMax: DEMO_LIMITS.MAX_TESTS,
    testsRemaining: DEMO_LIMITS.MAX_TESTS - testsUsed,
    patientId: patient?.id ?? null,
  };
}

export async function checkCanCreatePatient(userId: string): Promise<boolean> {
  const usage = await getDemoUsage(userId);
  return usage.canCreatePatient;
}

export async function checkCanCreateTest(userId: string): Promise<boolean> {
  const usage = await getDemoUsage(userId);
  return usage.canCreateTest;
}

export async function getTestsRemaining(userId: string): Promise<number> {
  const usage = await getDemoUsage(userId);
  return usage.testsRemaining;
}
