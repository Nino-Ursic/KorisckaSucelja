import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { accommodations, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import type { VacationType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as VacationType | null;

    let results = await db.query.accommodations.findMany({
      orderBy: [desc(accommodations.createdAt)],
    });

    if (type) {
      results = results.filter(a => a.vacationType === type);
    }

    return NextResponse.json({
      accommodations: results,
    });
  } catch (error) {
    console.error('Get accommodations error:', error);
    return NextResponse.json(
      { accommodations: [] },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, location, description, vacationType, pricePerNight, imageUrl } = body;

    if (!name || !location || !description || !vacationType || !pricePerNight) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAccommodation = await db.insert(accommodations).values({
      hostId: authUser.id,
      name,
      location,
      description,
      vacationType,
      pricePerNight: pricePerNight.toString(),
      imageUrl: imageUrl || null,
    }).returning();

    return NextResponse.json({ accommodation: newAccommodation[0] }, { status: 201 });
  } catch (error) {
    console.error('Create accommodation error:', error);
    return NextResponse.json({ error: 'Failed to create accommodation' }, { status: 500 });
  }
}
