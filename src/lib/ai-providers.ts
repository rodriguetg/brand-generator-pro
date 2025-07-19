import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Types pour les providers IA
export type AIProvider = 'openai' | 'gemini' | 'deepseek'

export interface AIConfig {
  provider: AIProvider
  model: string
  maxTokens: number
  temperature: number
}

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Configuration Gemini
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configuration DeepSeek (utilise l'API OpenAI-compatible)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

export class MultiAIService {
  private configs: Record<AIProvider, AIConfig> = {
    openai: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
      maxTokens: 300,
      temperature: 0.8
    },
    gemini: {
      provider: 'gemini',
      model: 'gemini-pro',
      maxTokens: 300,
      temperature: 0.8
    },
    deepseek: {
      provider: 'deepseek',
      model: 'deepseek-chat',
      maxTokens: 300,
      temperature: 0.8
    }
  }

  async generateBrandNames(
    sector: string, 
    style: string, 
    provider: AIProvider = 'openai'
  ): Promise<string[]> {
    const prompt = `Génère 10 noms de marque créatifs pour le secteur ${sector} avec un style ${style}. 
    Retourne uniquement une liste de noms, un par ligne, sans numérotation ni formatage.`

    try {
      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt)
        case 'gemini':
          return await this.generateWithGemini(prompt)
        case 'deepseek':
          return await this.generateWithDeepSeek(prompt)
        default:
          throw new Error(`Provider ${provider} non supporté`)
      }
    } catch (error) {
      console.error(`Erreur génération ${provider}:`, error)
      
      // Fallback vers OpenAI si le provider principal échoue
      if (provider !== 'openai') {
        console.log('Fallback vers OpenAI...')
        return await this.generateWithOpenAI(prompt)
      }
      
      throw new Error('Erreur lors de la génération des noms de marque')
    }
  }

  async generateSlogans(
    brandName: string, 
    sector: string, 
    provider: AIProvider = 'openai'
  ): Promise<string[]> {
    const prompt = `Génère 5 slogans accrocheurs pour la marque "${brandName}" dans le secteur ${sector}.
    Retourne uniquement une liste de slogans, un par ligne.`

    try {
      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt)
        case 'gemini':
          return await this.generateWithGemini(prompt)
        case 'deepseek':
          return await this.generateWithDeepSeek(prompt)
        default:
          throw new Error(`Provider ${provider} non supporté`)
      }
    } catch (error) {
      console.error(`Erreur génération slogans ${provider}:`, error)
      
      // Fallback vers OpenAI
      if (provider !== 'openai') {
        console.log('Fallback vers OpenAI...')
        return await this.generateWithOpenAI(prompt)
      }
      
      throw new Error('Erreur lors de la génération des slogans')
    }
  }

  private async generateWithOpenAI(prompt: string): Promise<string[]> {
    const response = await openai.chat.completions.create({
      model: this.configs.openai.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: this.configs.openai.maxTokens,
      temperature: this.configs.openai.temperature
    })

    const content = response.choices[0]?.message?.content || ''
    return this.parseResponse(content)
  }

  private async generateWithGemini(prompt: string): Promise<string[]> {
    const model = gemini.getGenerativeModel({ 
      model: this.configs.gemini.model 
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    return this.parseResponse(content)
  }

  private async generateWithDeepSeek(prompt: string): Promise<string[]> {
    const response = await deepseek.chat.completions.create({
      model: this.configs.deepseek.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: this.configs.deepseek.maxTokens,
      temperature: this.configs.deepseek.temperature
    })

    const content = response.choices[0]?.message?.content || ''
    return this.parseResponse(content)
  }

  private parseResponse(content: string): string[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '')) // Supprimer numérotation
      .map(line => line.replace(/^[-*]\s*/, '')) // Supprimer puces
      .filter(line => line.length > 0)
  }

  // Méthode pour tester la disponibilité des providers
  async testProvider(provider: AIProvider): Promise<boolean> {
    try {
      await this.generateBrandNames('test', 'moderne', provider)
      return true
    } catch (error) {
      console.error(`Provider ${provider} indisponible:`, error)
      return false
    }
  }

  // Obtenir le meilleur provider disponible
  async getBestAvailableProvider(): Promise<AIProvider> {
    const providers: AIProvider[] = ['openai', 'gemini', 'deepseek']
    
    for (const provider of providers) {
      if (await this.testProvider(provider)) {
        return provider
      }
    }
    
    throw new Error('Aucun provider IA disponible')
  }
}

export const multiAIService = new MultiAIService()