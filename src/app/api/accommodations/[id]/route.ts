import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { accommodations, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, params.id),
      with: {
        host: true,
      },
    });

    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 });
    }

    return NextResponse.json({ accommodation });
  } catch (error) {
    console.error('Get accommodation error:', error);
    return NextResponse.json({ error: 'Failed to get accommodation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (!dbUser || dbUser.role !== 'host') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const existing = await db.query.accommodations.findFirst({
      where: and(
        eq(accommodations.id, params.id),
        eq(accommodations.hostId, authUser.id)
      ),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Accommodation not found or not authorized' }, { status: 404 });
    }

    const body = await request.json();
    const { name, location, description, vacationType, pricePerNight, imageUrl } = body;

    if (!name || !location || !description || !vacationType || !pricePerNight) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await db.update(accommodations)
      .set({
        name,
        location,
        description,
        vacationType,
        pricePerNight: pricePerNight.toString(),
        imageUrl: imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(accommodations.id, params.id))
      .returning();

    return NextResponse.json({ accommodation: updated[0] });
  } catch (error) {
    console.error('Update accommodation error:', error);
    return NextResponse.json({ error: 'Failed to update accommodation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const existing = await db.query.accommodations.findFirst({
      where: and(
        eq(accommodations.id, params.id),
        eq(accommodations.hostId, authUser.id)
      ),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Accommodation not found or not authorized' }, { status: 404 });
    }

    await db.delete(accommodations).where(eq(accommodations.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete accommodation error:', error);
    return NextResponse.json({ error: 'Failed to delete accommodation' }, { status: 500 });
  }
}
