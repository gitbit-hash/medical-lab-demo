import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { results, status } = body;

    // Verify test exists and belongs to user's patient
    const test = await prisma.demoTest.findFirst({
      where: {
        id,
        created_by: session.user.id,
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Update the test
    const updatedTest = await prisma.demoTest.update({
      where: { id },
      data: {
        results: results || test.results,
        status: status || test.status,
      },
    });

    return NextResponse.json({ test: updatedTest });
  } catch (error) {
    console.error('Error updating demo test:', error);
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const test = await prisma.demoTest.findFirst({
      where: {
        id,
        created_by: session.user.id,
      },
      include: { patient: true },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error('Error fetching demo test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    );
  }
}
