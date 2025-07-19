// Monitoring des Core Web Vitals
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Envoyer les métriques à votre service d'analytics
    console.log('Web Vital:', metric)
    
    // Exemple avec Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  }
}

// Mesurer les performances des générations IA
export class PerformanceTracker {
  private static measurements: Map<string, number> = new Map()

  static startMeasurement(key: string): void {
    this.measurements.set(key, performance.now())
  }

  static endMeasurement(key: string): number {
    const startTime = this.measurements.get(key)
    if (!startTime) return 0

    const duration = performance.now() - startTime
    this.measurements.delete(key)

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${key}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  static async measureAsync<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasurement(key)
    try {
      const result = await fn()
      this.endMeasurement(key)
      return result
    } catch (error) {
      this.endMeasurement(key)
      throw error
    }
  }
}

// Hook pour mesurer les performances des composants
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now()

  return {
    logRenderTime: () => {
      const renderTime = performance.now() - startTime
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎨 ${componentName} render: ${renderTime.toFixed(2)}ms`)
      }
    }
  }
}