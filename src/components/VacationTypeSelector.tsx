'use client';

import { cn } from '@/lib/utils';
import { VACATION_TYPE_LABELS } from '@/types';
import type { VacationType } from '@/types';

interface VacationTypeSelectorProps {
  selected: VacationType | null;
  onSelect: (type: VacationType | null) => void;
}

const vacationTypes: VacationType[] = ['relax', 'adventure', 'city_break', 'family'];

export function VacationTypeSelector({ selected, onSelect }: VacationTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border',
          selected === null
            ? 'bg-amber-500 text-gray-950 border-amber-500'
            : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-300'
        )}
      >
        All
      </button>
      {vacationTypes.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border',
            selected === type
              ? 'bg-amber-500 text-gray-950 border-amber-500'
              : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-300'
          )}
        >
          {VACATION_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}