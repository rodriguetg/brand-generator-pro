import { multiAIService, AIProvider } from './ai-providers'
import { cacheService } from './cache'

export class OptimizedAIService {
  async generateBrandNames(
    sector: string, 
    style: string, 
    provider: AIProvider = 'openai'
  ): Promise<{ brands: string[], provider: AIProvider, fromCache: boolean }> {
    // Vérifier le cache d'abord
    const cachedBrands = await cacheService.getCachedBrands(sector, style, provider)
    
    if (cachedBrands) {
      console.log('🚀 Résultat depuis le cache')
      return { 
        brands: cachedBrands, 
        provider, 
        fromCache: true 
      }
    }

    try {
      // Générer avec l'IA
      const brands = await multiAIService.generateBrandNames(sector, style, provider)
      
      // Sauvegarder en cache
      await cacheService.setCachedBrands(sector, style, provider, brands)
      
      return { 
        brands, 
        provider, 
        fromCache: false 
      }
    } catch (error) {
      console.error('Erreur génération IA:', error)
      throw new Error('Erreur lors de la génération des noms de marque')
    }
  }

  async generateSlogans(
    brandName: string, 
    sector: string, 
    provider: AIProvider = 'openai'
  ): Promise<{ slogans: string[], provider: AIProvider, fromCache: boolean }> {
    // Vérifier le cache
    const cachedSlogans = await cacheService.getCachedSlogans(brandName, sector, provider)
    
    if (cachedSlogans) {
      console.log('🚀 Slogans depuis le cache')
      return { 
        slogans: cachedSlogans, 
        provider, 
        fromCache: true 
      }
    }

    try {
      // Générer avec l'IA
      const slogans = await multiAIService.generateSlogans(brandName, sector, provider)
      
      // Sauvegarder en cache
      await cacheService.setCachedSlogans(brandName, sector, provider, slogans)
      
      return { 
        slogans, 
        provider, 
        fromCache: false 
      }
    } catch (error) {
      console.error('Erreur génération slogans:', error)
      throw new Error('Erreur lors de la génération des slogans')
    }
  }

  // Pré-charger les combinaisons populaires
  async preloadPopularCombinations(): Promise<void> {
    const popularCombos = [
      { sector: 'tech', style: 'modern' },
      { sector: 'fashion', style: 'luxury' },
      { sector: 'food', style: 'creative' },
      { sector: 'health', style: 'professional' }
    ]

    const providers: AIProvider[] = ['openai', 'gemini', 'deepseek']

    for (const combo of popularCombos) {
      for (const provider of providers) {
        try {
          await this.generateBrandNames(combo.sector, combo.style, provider)
          console.log(`✅ Pré-chargé: ${combo.sector}/${combo.style}/${provider}`)
        } catch (error) {
          console.log(`❌ Échec pré-chargement: ${combo.sector}/${combo.style}/${provider}`)
        }
      }
    }
  }
}

export const optimizedAIService = new OptimizedAIService()