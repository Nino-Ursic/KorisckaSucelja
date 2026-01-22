import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { users, accommodations, bookings } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { VACATION_TYPE_LABELS } from '@/types';
import type { VacationType } from '@/types';
import { Plus, MapPin, Calendar, ChevronRight, Home, Inbox } from 'lucide-react';

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

async function getHostAccommodations(hostId: string) {
  try {
    const results = await db.query.accommodations.findMany({
      where: eq(accommodations.hostId, hostId),
      orderBy: [desc(accommodations.createdAt)],
    });

    return results;
  } catch {
    return [];
  }
}

async function getHostBookings(hostId: string) {
  try {
    const hostAccommodations = await db.query.accommodations.findMany({
      where: eq(accommodations.hostId, hostId),
    });

    if (hostAccommodations.length === 0) {
      return { upcoming: [], past: [] };
    }

    const accommodationIds = hostAccommodations.map(a => a.id);

    const hostBookings = await db.query.bookings.findMany({
      where: inArray(bookings.accommodationId, accommodationIds),
      with: {
        accommodation: true,
        guest: true,
      },
      orderBy: [desc(bookings.checkIn)],
    });

    const now = new Date();
    const upcoming = hostBookings.filter(b => new Date(b.checkIn) >= now && b.status === 'confirmed');
    const past = hostBookings.filter(b => new Date(b.checkIn) < now || b.status !== 'confirmed');

    return { upcoming, past };
  } catch {
    return { upcoming: [], past: [] };
  }
}

interface SearchParams {
  success?: string;
}

export default async function HostDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {

  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'host') {
    redirect('/dashboard/guest');
  }

  const hostAccommodations = await getHostAccommodations(user.id);
  const { upcoming: upcomingBookings, past: pastBookings } = await getHostBookings(user.id);
  const showSuccess = resolvedSearchParams.success === 'create' || resolvedSearchParams.success === 'edit';

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-2">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {user.fullName}</h1>
          </div>
          <Link href="/dashboard/host/accommodations/new">
            <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Add New Listing
            </Button>
          </Link>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-8">
            {resolvedSearchParams.success === 'create' 
              ? '✓ Your listing has been created successfully!'
              : '✓ Your listing has been updated successfully!'}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-3xl font-bold text-white">{hostAccommodations.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Listings</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-3xl font-bold text-green-500">{upcomingBookings.length}</p>
            <p className="text-sm text-gray-500 mt-1">Upcoming Bookings</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-3xl font-bold text-gray-400">{pastBookings.length}</p>
            <p className="text-sm text-gray-500 mt-1">Past Bookings</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-3xl font-bold text-amber-500">
              {formatCurrency(upcomingBookings.reduce((sum, b) => sum + parseFloat(b.totalPrice), 0))}
            </p>
            <p className="text-sm text-gray-500 mt-1">Upcoming Revenue</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Upcoming Bookings
          </h2>
          
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                            Confirmed
                          </span>
                          <span className="text-sm text-gray-500">
                            {VACATION_TYPE_LABELS[booking.accommodation.vacationType as VacationType]}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-white">{booking.accommodation.name}</h3>
                        <p className="text-sm text-gray-500">{booking.accommodation.location}</p>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-1">
                        <p className="font-bold text-amber-500 text-xl">{formatCurrency(parseFloat(booking.totalPrice))}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 my-5" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-white">
                            {booking.guest.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{booking.guest.fullName}</p>
                          <p className="text-sm text-gray-500">{booking.guest.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-gray-500">Check-in</p>
                          <p className="font-medium text-white">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check-out</p>
                          <p className="font-medium text-white">{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <Inbox className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">No upcoming bookings</h3>
              <p className="text-gray-500">
                When guests book your accommodations, they will appear here.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-500" />
            Your Listings ({hostAccommodations.length})
          </h2>
          
          {hostAccommodations.length > 0 ? (
            <div className="space-y-4">
              {hostAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32 sm:h-auto bg-gray-800 flex-shrink-0">
                      {accommodation.imageUrl ? (
                        <img
                          src={accommodation.imageUrl}
                          alt={accommodation.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <Home className="w-10 h-10 text-gray-700" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            {accommodation.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {accommodation.location}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full border border-gray-700">
                          {VACATION_TYPE_LABELS[accommodation.vacationType as VacationType]}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                        {accommodation.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <p className="font-bold text-amber-500">
                          {formatCurrency(parseFloat(accommodation.pricePerNight))}
                          <span className="text-sm font-normal text-gray-500"> / night</span>
                        </p>
                        <div className="flex gap-2">
                          <Link href={`/accommodations/${accommodation.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/host/accommodations/${accommodation.id}/edit`}>
                            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <Home className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">No listings yet</h3>
              <p className="text-gray-500 mb-6">Start hosting by adding your first property!</p>
              <Link href="/dashboard/host/accommodations/new">
                <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
                  Add Your First Listing
                </Button>
              </Link>
            </div>
          )}
        </section>

        {pastBookings.length > 0 && (
          <section>
            <details className="group">
              <summary className="text-xl font-semibold text-white mb-4 cursor-pointer list-none flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
                Past Bookings ({pastBookings.length})
              </summary>
              
              <div className="space-y-4 mt-4">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                              booking.status === 'confirmed' 
                                ? 'bg-gray-800 text-gray-400 border-gray-700' 
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                              {booking.status === 'confirmed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </div>
                          <h3 className="font-semibold text-white">{booking.accommodation.name}</h3>
                          <p className="text-sm text-gray-500">
                            Guest: {booking.guest.fullName}
                          </p>
                        </div>
                        
                        <div className="text-sm text-right">
                          <p className="text-gray-500">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                          <p className="font-medium text-white">{formatCurrency(parseFloat(booking.totalPrice))}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </section>
        )}
      </div>
    </div>
  );
}