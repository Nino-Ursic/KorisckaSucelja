import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { users, bookings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { BookingCard } from '@/components/BookingCard';
import { Search, Calendar, Palmtree } from 'lucide-react';
import type { VacationType } from '@/types';

async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    return dbUser;
  } catch {
    return null;
  }
}

async function getGuestBookings(guestId: string) {
  try {
    const now = new Date();
    
    const results = await db.query.bookings.findMany({
      where: eq(bookings.guestId, guestId),
      with: {
        accommodation: true,
      },
      orderBy: [desc(bookings.checkIn)],
    });

    const upcoming = results.filter(b => new Date(b.checkIn) >= now && b.status === 'confirmed');
    const past = results.filter(b => new Date(b.checkIn) < now || b.status !== 'confirmed');

    return { upcoming, past };
  } catch {
    return { upcoming: [], past: [] };
  }
}

interface SearchParams {
  success?: string;
}

export default async function GuestDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'guest') {
    redirect('/dashboard/host');
  }

  const { upcoming, past } = await getGuestBookings(user.id);
  const showSuccess = resolvedSearchParams.success === 'booking';

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-2">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome, {user.fullName}</h1>
            <p className="text-gray-400 mt-1">Manage your bookings and explore new destinations</p>
          </div>
          <Link href="/accommodations">
            <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
              <Search className="w-5 h-5 mr-2" />
              Browse Accommodations
            </Button>
          </Link>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-8">
            ✓ Your booking has been confirmed! Check your upcoming reservations below.
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Upcoming Reservations
          </h2>
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  accommodation={{
                    id: booking.accommodation.id,
                    name: booking.accommodation.name,
                    location: booking.accommodation.location,
                    vacationType: booking.accommodation.vacationType as VacationType,
                    imageUrl: booking.accommodation.imageUrl,
                  }}
                  checkIn={booking.checkIn}
                  checkOut={booking.checkOut}
                  totalPrice={parseFloat(booking.totalPrice)}
                  status={booking.status}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <Palmtree className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">No upcoming trips</h3>
              <p className="text-gray-500 mb-6">Time to plan your next adventure!</p>
              <Link href="/accommodations">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Explore Accommodations
                </Button>
              </Link>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-6">Past Reservations</h2>
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((booking) => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  accommodation={{
                    id: booking.accommodation.id,
                    name: booking.accommodation.name,
                    location: booking.accommodation.location,
                    vacationType: booking.accommodation.vacationType as VacationType,
                    imageUrl: booking.accommodation.imageUrl,
                  }}
                  checkIn={booking.checkIn}
                  checkOut={booking.checkOut}
                  totalPrice={parseFloat(booking.totalPrice)}
                  status={booking.status}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500">No past reservations yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}