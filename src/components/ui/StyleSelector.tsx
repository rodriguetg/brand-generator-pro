'use client'

import { STYLES } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StyleSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function StyleSelector({ value, onChange, className }: StyleSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        Style de marque
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {STYLES.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => onChange(style.value)}
            className={cn(
              'text-left p-4 rounded-lg border-2 transition-all hover:border-brand-300',
              value === style.value
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            )}
          >
            <div className="font-medium text-gray-900 mb-1">{style.label}</div>
            <div className="text-sm text-gray-600">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}