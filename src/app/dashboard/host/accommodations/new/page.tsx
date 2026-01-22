import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { AccommodationForm } from '@/components/forms/AccommodationForm';
import { ArrowLeft } from 'lucide-react';

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

export default async function NewAccommodationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'host') {
    redirect('/dashboard/guest');
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
          <h1 className="text-3xl font-bold text-white mb-2">Add New Listing</h1>
          <p className="text-gray-400">
            Fill in the details below to create your new accommodation listing
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <AccommodationForm mode="create" />
        </div>
      </div>
    </div>
  );
}