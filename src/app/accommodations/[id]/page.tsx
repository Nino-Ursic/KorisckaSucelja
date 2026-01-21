import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { accommodations, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { BookingForm } from '@/components/forms/BookingForm';
import { formatCurrency } from '@/lib/utils';
import { VACATION_TYPE_LABELS } from '@/types';
import { ArrowLeft, MapPin, Home } from 'lucide-react';
import type { VacationType } from '@/types';

async function getAccommodation(id: string) {
  try {
    const result = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
      with: {
        host: true,
      },
    });

    return result;
  } catch {
    return null;
  }
}

async function getCurrentUser() {
  try {
    const supabase = createClient();
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

interface PageProps {
  params: { id: string };
}

export default async function AccommodationDetailPage({ params }: PageProps) {
  const accommodation = await getAccommodation(params.id);
  const currentUser = await getCurrentUser();

  if (!accommodation) {
    notFound();
  }

  const pricePerNight = parseFloat(accommodation.pricePerNight);
  const isGuest = currentUser?.role === 'guest';

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container">
        <Link 
          href="/accommodations"
          className="inline-flex items-center text-sm text-gray-400 hover:text-amber-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 bg-gray-900 rounded-2xl overflow-hidden mb-8">
              {accommodation.imageUrl ? (
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <Home className="w-24 h-24 text-gray-700" />
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {accommodation.name}
                  </h1>
                  <span className="px-3 py-1.5 bg-gray-900 text-gray-300 text-sm font-medium rounded-full border border-gray-800 flex-shrink-0">
                    {VACATION_TYPE_LABELS[accommodation.vacationType as VacationType]}
                  </span>
                </div>
                <p className="text-gray-400 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  {accommodation.location}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">About this place</h2>
                <p className="text-gray-400 whitespace-pre-line leading-relaxed">{accommodation.description}</p>
              </div>

              {accommodation.host && (
                <div className="border-t border-gray-800 pt-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Hosted by</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-semibold text-amber-500">
                        {accommodation.host.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white text-lg">{accommodation.host.fullName}</p>
                      <p className="text-gray-500">Host</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl sticky top-24">
              <div className="p-6">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-amber-500">
                    {formatCurrency(pricePerNight)}
                  </span>
                  <span className="text-gray-500">/ night</span>
                </div>

                {isGuest ? (
                  <BookingForm 
                    accommodationId={accommodation.id}
                    pricePerNight={pricePerNight}
                  />
                ) : currentUser ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">
                      Only guests can book accommodations.
                    </p>
                    <Link href="/dashboard/host">
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                        Go to Host Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">
                      Sign in to book this accommodation
                    </p>
                    <Link href="/auth/login">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
                        Sign In to Book
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                      Don't have an account?{' '}
                      <Link href="/auth/signup" className="text-amber-500 hover:text-amber-400">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}