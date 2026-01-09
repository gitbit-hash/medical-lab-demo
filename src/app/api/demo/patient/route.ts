import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkCanCreatePatient } from '@/lib/demo-limits';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check demo limits
    const canCreate = await checkCanCreatePatient(session.user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Demo limit reached. You can only create 1 patient.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, gender, age_value, age_unit, phone, email, address } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create the patient
    const patient = await prisma.demoPatient.create({
      data: {
        name,
        gender: gender || null,
        age_value: age_value ? parseFloat(age_value) : null,
        age_unit: age_unit || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        created_by: session.user.id,
      },
    });

    // Update user's demo count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { demo_patients_created: { increment: 1 } },
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error('Error creating demo patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.demoPatient.findFirst({
      where: { created_by: session.user.id },
      include: { tests: true },
    });

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Error fetching demo patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}
