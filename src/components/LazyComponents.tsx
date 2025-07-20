import dynamic from 'next/dynamic'

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