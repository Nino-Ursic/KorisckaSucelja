import { getSiteContent } from '@/lib/contentful';
import { VACATION_TYPE_LABELS } from '@/types';
import type { VacationType } from '@/types';
import { Palmtree, Map, Building2, UsersRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default async function AboutPage() {
  const siteContent = await getSiteContent();

  const vacationTypes: { type: VacationType; icon: React.ReactNode; description: string }[] = [
  { type: 'relax', icon: <Palmtree className="w-6 h-6 transition-colors" strokeWidth={1.5} />, description: 'Wellness & peace' },
  { type: 'adventure', icon: <Map className="w-6 h-6 transition-colors" strokeWidth={1.5} />, description: 'Outdoor thrills' },
  { type: 'city_break', icon: <Building2 className="w-6 h-6 transition-colors" strokeWidth={1.5} />, description: 'Culture & history' },
  { type: 'family', icon: <UsersRound className="w-6 h-6 transition-colors" strokeWidth={1.5} />, description: 'Kid-friendly' },
];

  return (
    <div className="min-h-screen bg-gray-950">
      <section className="py-20 border-b border-gray-900">
        <div className="container max-w-4xl">
          <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {siteContent.appName}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Your gateway to unforgettable experiences in beautiful Dalmatia, Croatia.
          </p>
        </div>
      </section>

      <section className="py-20 border-b border-gray-900">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Our Mission</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We connect travelers with unique accommodations across the stunning Dalmatian coast and its hinterland. 
            Whether you're seeking a peaceful retreat, an adventurous escape, a cultural city break, or a 
            family-friendly destination, we have the perfect place for you.
          </p>
        </div>
      </section>

      <section className="py-20 border-b border-gray-900">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Discover Dalmatia</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Dalmatia is a region of breathtaking natural beauty, rich history, and warm hospitality. 
            From the ancient walls of Dubrovnik to the vibrant streets of Split, from the crystal-clear 
            waters of Hvar to the rugged peaks of Biokovo, there's something for every type of traveler.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vacationTypes.map(({ type, icon, description }) => (
              <Link
                key={type}
                href={`/accommodations?type=${type}`}
                className="group bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="text-gray-600 group-hover:text-amber-500 flex justify-center mb-3">

</div>
                <p className="font-medium text-white mb-1">{VACATION_TYPE_LABELS[type]}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-2xl font-semibold text-white mb-4">For Hosts</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Are you a property owner in Dalmatia? Join our community of hosts and share your space 
                with travelers from around the world. Our platform makes it easy to list your property, 
                manage bookings, and earn extra income while helping guests create lasting memories.
              </p>
              <Link href="/auth/signup">
                <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
                  Become a Host
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}