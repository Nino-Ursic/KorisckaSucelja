import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { users, accommodations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { AccommodationForm } from '@/components/forms/AccommodationForm';
import { ArrowLeft } from 'lucide-react';
import type { VacationType } from '@/types';

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

async function getAccommodation(id: string, hostId: string) {
  try {
    const result = await db.query.accommodations.findFirst({
      where: and(
        eq(accommodations.id, id),
        eq(accommodations.hostId, hostId)
      ),
    });

    return result;
  } catch {
    return null;
  }
}

interface PageProps {
  params: { id: string };
}

export default async function EditAccommodationPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'host') {
    redirect('/dashboard/guest');
  }

  const accommodation = await getAccommodation(params.id, user.id);

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container max-w-2xl">
        <Link 
          href="/dashboard/host"
          className="inline-flex items-center text-sm text-gray-400 hover:text-amber-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Listing</h1>
          <p className="text-gray-400">
            Update the details of your accommodation listing
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <AccommodationForm 
            mode="edit" 
            initialData={{
              id: accommodation.id,
              name: accommodation.name,
              location: accommodation.location,
              description: accommodation.description,
              vacationType: accommodation.vacationType as VacationType,
              pricePerNight: parseFloat(accommodation.pricePerNight),
              imageUrl: accommodation.imageUrl || undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}