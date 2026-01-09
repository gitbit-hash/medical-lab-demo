import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkCanCreateTest, getTestsRemaining } from '@/lib/demo-limits';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { patient_id, tests } = body;

    if (!patient_id || !tests || !Array.isArray(tests) || tests.length === 0) {
      return NextResponse.json(
        { error: 'Patient ID and tests array are required' },
        { status: 400 }
      );
    }

    // Check demo limits
    const canCreate = await checkCanCreateTest(session.user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Demo limit reached. You can only create 5 tests.' },
        { status: 403 }
      );
    }

    // Check how many tests can be added
    const remaining = await getTestsRemaining(session.user.id);
    if (tests.length > remaining) {
      return NextResponse.json(
        { error: `You can only add ${remaining} more tests.` },
        { status: 403 }
      );
    }

    // Verify patient exists and belongs to user
    const patient = await prisma.demoPatient.findFirst({
      where: {
        id: patient_id,
        created_by: session.user.id,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Create the tests
    const createdTests = await prisma.demoTest.createMany({
      data: tests.map((test: { test_type: string; test_code?: string }) => ({
        patient_id,
        test_type: test.test_type,
        test_code: test.test_code || null,
        created_by: session.user.id,
      })),
    });

    // Update user's demo count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { demo_tests_created: { increment: tests.length } },
    });

    return NextResponse.json({ count: createdTests.count }, { status: 201 });
  } catch (error) {
    console.error('Error creating demo tests:', error);
    return NextResponse.json(
      { error: 'Failed to create tests' },
      { status: 500 }
    );
  }
}
