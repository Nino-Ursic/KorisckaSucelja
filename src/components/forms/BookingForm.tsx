'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface BookingFormProps {
  accommodationId: string;
  pricePerNight: number;
}

export function BookingForm({ accommodationId, pricePerNight }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split('T')[0]);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(0, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = nights * pricePerNight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (checkOutDate <= checkInDate) {
      setError('Check-out must be after check-in');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accommodationId,
          checkIn,
          checkOut,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      router.push('/dashboard/guest?success=booking');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Check-in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={tomorrow.toISOString().split('T')[0]}
          required
          className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors [color-scheme:dark]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn}
          required
          className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors [color-scheme:dark]"
        />
      </div>

      {nights > 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>{formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold pt-2 border-t border-gray-800">
            <span>Total</span>
            <span className="text-amber-500">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3" 
        isLoading={isLoading}
        disabled={nights === 0}
      >
        Book Now
      </Button>
    </form>
  );
}