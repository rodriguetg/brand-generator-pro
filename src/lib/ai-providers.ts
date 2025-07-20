import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'gemini' | 'deepseek'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const gemini = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ''
)

// Deepseek: ici on simule, à remplacer par l'API réelle si besoin
async function deepseekGenerate(prompt: string): Promise<string[]> {
  // Simule une réponse IA
  return [
    'Deepseek Brand 1',
    'Deepseek Brand 2',
    'Deepseek Brand 3',
    'Deepseek Brand 4',
    'Deepseek Brand 5',
  ]
}

export const multiAIService = {
  async generateBrandNames(sector: string, style: string, provider: AIProvider): Promise<string[]> {
    const prompt = `Génère 6 noms de marque créatifs et mémorables pour le secteur "${sector}" avec un style "${style}".\nCritères:\n- Noms courts (2-3 mots max)\n- Faciles à prononcer\n- Modernes et accrocheurs\n- Adaptés au secteur ${sector}\n- Style ${style}\nFormat: liste simple, un nom par ligne, sans numérotation.`
    try {
      if (provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.8,
        })
        return parseResponse(completion.choices[0]?.message?.content || '')
      } else if (provider === 'gemini') {
        const model = gemini.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        return parseResponse(text)
      } else if (provider === 'deepseek') {
        return await deepseekGenerate(prompt)
      }
      throw new Error('Provider IA inconnu')
    } catch (error) {
      // Fallback OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      })
      return parseResponse(completion.choices[0]?.message?.content || '')
    }
  },

  async generateSlogans(brandName: string, sector: string, provider: AIProvider): Promise<string[]> {
    const prompt = `Génère 5 slogans accrocheurs pour la marque "${brandName}" dans le secteur ${sector}.\nFormat: liste simple, un slogan par ligne, sans numérotation.`
    try {
      if (provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        })
        return parseResponse(completion.choices[0]?.message?.content || '')
      } else if (provider === 'gemini') {
        const model = gemini.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        return parseResponse(text)
      } else if (provider === 'deepseek') {
        return await deepseekGenerate(prompt)
      }
      throw new Error('Provider IA inconnu')
    } catch (error) {
      // Fallback OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      })
      return parseResponse(completion.choices[0]?.message?.content || '')
    }
  },

  // Pour les tests
  parseResponse,
}

function parseResponse(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
    .filter(line => line.length > 0)
} 