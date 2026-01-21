import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, users, accommodations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { calculateNights, calculateTotalPrice } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userBookings = await db.query.bookings.findMany({
      where: eq(bookings.guestId, authUser.id),
      with: {
        accommodation: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    return NextResponse.json({ bookings: userBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Failed to get bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (!dbUser || dbUser.role !== 'guest') {
      return NextResponse.json({ error: 'Only guests can make bookings' }, { status: 403 });
    }

    const body = await request.json();
    const { accommodationId, checkIn, checkOut } = body;

    if (!accommodationId || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    if (checkInDate < new Date()) {
      return NextResponse.json({ error: 'Check-in cannot be in the past' }, { status: 400 });
    }

    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, accommodationId),
    });

    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 });
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = calculateTotalPrice(parseFloat(accommodation.pricePerNight), nights);

    const newBooking = await db.insert(bookings).values({
      accommodationId,
      guestId: authUser.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice: totalPrice.toString(),
      status: 'confirmed',
    }).returning();

    return NextResponse.json({ booking: newBooking[0] }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
