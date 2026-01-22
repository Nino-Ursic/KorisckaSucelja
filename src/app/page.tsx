import Link from 'next/link';
import { getSiteContent } from '@/lib/contentful';
import { Button } from '@/components/ui';
import { AccommodationCard } from '@/components/AccommodationCard';
import { VACATION_TYPE_LABELS, VACATION_TYPE_ICONS } from '@/types';
import type { VacationType } from '@/types';
import { db } from '@/db';
import { accommodations } from '@/db/schema';
import { desc } from 'drizzle-orm';

async function getFeaturedAccommodations() {
  try {
    const results = await db.query.accommodations.findMany({
      limit: 4,
      orderBy: [desc(accommodations.createdAt)],
    });
    return results;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const siteContent = await getSiteContent();
  const featuredAccommodations = await getFeaturedAccommodations();

  const vacationTypes: VacationType[] = ['relax', 'adventure', 'city_break', 'family'];

  const vacationTypeDescriptions: Record<VacationType, string> = {
    relax: 'Wellness retreats & peaceful escapes',
    adventure: 'Thrilling outdoor experiences',
    city_break: 'Culture, history & urban exploration',
    family: 'Kid-friendly spaces for all ages',
  };

  return (
    <div className="bg-gray-950">
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {siteContent.heroTitle}
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              {siteContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/accommodations">
                <Button size="lg" variant="primary" className="px-8">
                  Explore Properties
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline">
                  List Your Property
                </Button>
              </Link>
            </div>

            <div className="flex gap-12 mt-16 pt-16 border-t border-gray-800">
              <div>
                <p className="text-4xl font-bold text-white">5+</p>
                <p className="text-gray-500 text-sm mt-1">Properties</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">3+</p>
                <p className="text-gray-500 text-sm mt-1">Locations</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">4.8</p>
                <p className="text-gray-500 text-sm mt-1">Avg. Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-950 border-t border-gray-900">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-3">
              Experiences
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Find Your Perfect Escape
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vacationTypes.map((type) => (
              <Link
                key={type}
                href={`/accommodations?type=${type}`}
                className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                
                <div className="relative">
                  <span className="text-4xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all duration-300">
                    {VACATION_TYPE_ICONS[type]}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {VACATION_TYPE_LABELS[type]}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {vacationTypeDescriptions[type]}
                  </p>
                  
                  <div className="mt-6 flex items-center text-amber-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900/50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-3">
                Curated Selection
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Featured Properties
              </h2>
            </div>
            <Link 
              href="/accommodations" 
              className="hidden md:flex items-center text-gray-400 hover:text-amber-500 font-medium transition-colors"
            >
              View all properties
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {featuredAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAccommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  id={accommodation.id}
                  name={accommodation.name}
                  location={accommodation.location}
                  description={accommodation.description}
                  vacationType={accommodation.vacationType}
                  pricePerNight={parseFloat(accommodation.pricePerNight)}
                  imageUrl={accommodation.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
              <p className="text-gray-500">No properties available yet.</p>
            </div>
          )}

          <div className="mt-8 md:hidden text-center">
            <Link href="/accommodations">
              <Button variant="outline">
                View all properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-950 border-t border-gray-900">
        <div className="container">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative max-w-2xl">
              <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-4">
                Become a Host
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Share Your Space, <br />Earn Extra Income
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join our community of hosts across Dalmatia. List your property and connect with travelers seeking authentic Croatian experiences.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" variant="primary" className="px-8">
                  Start Hosting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 bg-gray-900" />
    </div>
  );
}