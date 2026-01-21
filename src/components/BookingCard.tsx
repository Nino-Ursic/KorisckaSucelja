import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { VACATION_TYPE_LABELS } from '@/types';
import { MapPin, Home } from 'lucide-react';
import type { VacationType } from '@/types';

interface BookingCardProps {
  id: string;
  accommodation: {
    id: string;
    name: string;
    location: string;
    vacationType: VacationType;
    imageUrl: string | null;
  };
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
}

export function BookingCard({
  id,
  accommodation,
  checkIn,
  checkOut,
  totalPrice,
  status,
}: BookingCardProps) {
  const isUpcoming = new Date(checkIn) >= new Date() && status === 'confirmed';

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden ${!isUpcoming ? 'opacity-75' : ''}`}>
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
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                  status === 'confirmed' && isUpcoming
                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                    : status === 'confirmed'
                    ? 'bg-gray-800 text-gray-400 border-gray-700'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {status === 'confirmed' && isUpcoming ? 'Confirmed' : status === 'confirmed' ? 'Completed' : 'Cancelled'}
                </span>
                <span className="text-sm text-gray-500">
                  {VACATION_TYPE_LABELS[accommodation.vacationType]}
                </span>
              </div>
              <Link href={`/accommodations/${accommodation.id}`}>
                <h3 className="font-semibold text-lg text-white hover:text-amber-500 transition-colors">
                  {accommodation.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {accommodation.location}
              </p>
            </div>
            <p className="font-bold text-amber-500 text-xl">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <div className="flex gap-6 text-sm pt-3 border-t border-gray-800">
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="font-medium text-white">{formatDate(checkIn)}</p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="font-medium text-white">{formatDate(checkOut)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}