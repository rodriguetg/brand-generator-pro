'use client'

import { SECTORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SectorSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SectorSelector({ value, onChange, className }: SectorSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Secteur d'activité
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {SECTORS.map((sector) => (
          <button
            key={sector.value}
            type="button"
            onClick={() => onChange(sector.value)}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:border-brand-300',
              value === sector.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            <span className="text-2xl mb-2">{sector.icon}</span>
            <span className="text-sm font-medium text-center">{sector.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}