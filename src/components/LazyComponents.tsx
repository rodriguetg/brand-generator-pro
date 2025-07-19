import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Lazy loading avec loading states
export const LazyBrandGenerator = dynamic(
  () => import('./BrandGeneratorOptimized').then(mod => ({ default: mod.BrandGeneratorOptimized })),
  {
    loading: () => (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    ),
    ssr: false
  }
)

export const LazyPricingSection = dynamic(
  () => import('./PricingSection'),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }
)

export const LazyProjectsGrid = dynamic(
  () => import('./ProjectsGrid'),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }
)

export const LazyAnalyticsDashboard = dynamic(
  () => import('./AnalyticsDashboard'),
  {
    loading: () => (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    )
  }
)