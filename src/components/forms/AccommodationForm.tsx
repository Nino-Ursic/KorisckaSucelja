'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { VACATION_TYPE_LABELS } from '@/types';
import { Home, MapPin, FileText, Tag, DollarSign, Image, ChevronDown } from 'lucide-react';
import type { VacationType, AccommodationFormData } from '@/types';

interface AccommodationFormProps {
  initialData?: AccommodationFormData & { id: string };
  mode: 'create' | 'edit';
}

export function AccommodationForm({ initialData, mode }: AccommodationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<AccommodationFormData>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    vacationType: initialData?.vacationType || 'relax',
    pricePerNight: initialData?.pricePerNight || 0,
    imageUrl: initialData?.imageUrl || '',
  });

  const handleChange = (field: keyof AccommodationFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.location || !formData.description || !formData.pricePerNight) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const url = mode === 'create' ? '/api/accommodations' : `/api/accommodations/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save accommodation');
      }

      router.push('/dashboard/host?success=' + mode);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Property Name
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="e.g., Seaside Villa with Pool"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="e.g., Split, Croatia"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <textarea
            placeholder="Describe your property..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={4}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Vacation Type
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={formData.vacationType}
            onChange={(e) => handleChange('vacationType', e.target.value as VacationType)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-10 text-white appearance-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
          >
            {Object.entries(VACATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Price per Night (EUR)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="number"
            placeholder="100"
            min={1}
            step={0.01}
            value={formData.pricePerNight || ''}
            onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || 0)}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Image URL <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl || ''}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold" 
          isLoading={isLoading}
        >
          {mode === 'create' ? 'Create Listing' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}