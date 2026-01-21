'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AccommodationCard } from '@/components/AccommodationCard';
import { VacationTypeSelector } from '@/components/VacationTypeSelector';
import { Home, Loader2 } from 'lucide-react';
import type { VacationType } from '@/types';

interface Accommodation {
  id: string;
  name: string;
  location: string;
  description: string;
  vacationType: VacationType;
  pricePerNight: string;
  imageUrl: string | null;
}

export default function AccommodationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type') as VacationType | null;
  
  const [selectedType, setSelectedType] = useState<VacationType | null>(typeParam);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      try {
        const url = selectedType 
          ? `/api/accommodations?type=${selectedType}`
          : '/api/accommodations';
        
        const response = await fetch(url);
        const data = await response.json();
        
        setAccommodations(data.accommodations || []);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
        setAccommodations([]);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchAccommodations();
  }, [selectedType]);

  const handleTypeSelect = (type: VacationType | null) => {
    setSelectedType(type);
    if (type) {
      router.push(`/accommodations?type=${type}`, { scroll: false });
    } else {
      router.push('/accommodations', { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container">
        <div className="mb-12">
          <p className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-3">
            Browse Properties
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Accommodations
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Find the perfect place for your next adventure in beautiful Dalmatia
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Filter by experience
          </h2>
          <div className="flex items-center gap-4">
            <VacationTypeSelector selected={selectedType} onSelect={handleTypeSelect} />
            {isLoading && !isInitialLoad && (
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            )}
          </div>
        </div>

        {isInitialLoad ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : accommodations.length > 0 ? (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {accommodations.length} {accommodations.length === 1 ? 'property' : 'properties'} found
            </p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {accommodations.map((accommodation) => (
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
          </>
        ) : (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
            <Home className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No accommodations found</h3>
            <p className="text-gray-500">
              {selectedType 
                ? 'Try selecting a different vacation type'
                : 'Check back later for new listings'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}