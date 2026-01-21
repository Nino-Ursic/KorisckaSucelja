import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { VACATION_TYPE_LABELS, VACATION_TYPE_ICONS } from '@/types';
import type { VacationType } from '@/types';

interface AccommodationCardProps {
  id: string;
  name: string;
  location: string;
  description: string;
  vacationType: VacationType;
  pricePerNight: number;
  imageUrl: string | null;
}

export function AccommodationCard({
  id,
  name,
  location,
  description,
  vacationType,
  pricePerNight,
  imageUrl,
}: AccommodationCardProps) {
  return (
    <Link href={`/accommodations/${id}`}>
      <div className="group h-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-52 bg-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-5xl opacity-50 group-hover:opacity-75 transition-opacity">
                  {VACATION_TYPE_ICONS[vacationType]}
                </span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-700">
              {VACATION_TYPE_ICONS[vacationType]} {VACATION_TYPE_LABELS[vacationType]}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-3 py-1 bg-amber-500 text-gray-950 text-sm font-bold rounded-lg">
              {formatCurrency(pricePerNight)}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
          <p className="text-sm text-gray-400 mt-3 line-clamp-2 leading-relaxed">{description}</p>
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Per night</span>
            <span className="text-amber-500 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View details
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}