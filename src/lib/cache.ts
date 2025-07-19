import { Redis } from '@upstash/redis'

// Configuration Redis (Upstash pour simplicité)
const redis = process.env.REDIS_URL 
  ? new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    })
  : null

export class CacheService {
  private static instance: CacheService
  private redis: Redis | null

  constructor() {
    this.redis = redis
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  // Générer une clé de cache pour les générations IA
  private generateCacheKey(type: 'brands' | 'slogans', params: any): string {
    const paramsString = JSON.stringify(params)
    const hash = Buffer.from(paramsString).toString('base64')
    return `ai:${type}:${hash}`
  }

  // Cache pour les noms de marque
  async getCachedBrands(sector: string, style: string, provider: string): Promise<string[] | null> {
    if (!this.redis) return null

    try {
      const key = this.generateCacheKey('brands', { sector, style, provider })
      const cached = await this.redis.get(key)
      return cached as string[] | null
    } catch (error) {
      console.error('Erreur cache Redis:', error)
      return null
    }
  }

  async setCachedBrands(
    sector: string, 
    style: string, 
    provider: string, 
    brands: string[]
  ): Promise<void> {
    if (!this.redis) return

    try {
      const key = this.generateCacheKey('brands', { sector, style, provider })
      // Cache pendant 1 heure
      await this.redis.setex(key, 3600, JSON.stringify(brands))
    } catch (error) {
      console.error('Erreur sauvegarde cache:', error)
    }
  }

  // Cache pour les slogans
  async getCachedSlogans(brandName: string, sector: string, provider: string): Promise<string[] | null> {
    if (!this.redis) return null

    try {
      const key = this.generateCacheKey('slogans', { brandName, sector, provider })
      const cached = await this.redis.get(key)
      return cached as string[] | null
    } catch (error) {
      console.error('Erreur cache Redis:', error)
      return null
    }
  }

  async setCachedSlogans(
    brandName: string, 
    sector: string, 
    provider: string, 
    slogans: string[]
  ): Promise<void> {
    if (!this.redis) return

    try {
      const key = this.generateCacheKey('slogans', { brandName, sector, provider })
      // Cache pendant 1 heure
      await this.redis.setex(key, 3600, JSON.stringify(slogans))
    } catch (error) {
      console.error('Erreur sauvegarde cache:', error)
    }
  }

  // Invalider le cache
  async invalidateCache(pattern: string): Promise<void> {
    if (!this.redis) return

    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Erreur invalidation cache:', error)
    }
  }
}

export const cacheService = CacheService.getInstance()