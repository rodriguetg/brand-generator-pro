import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class AIService {
  async generateBrandNames(sector: string, style: string): Promise<string[]> {
    const prompt = `Génère 10 noms de marque créatifs pour le secteur ${sector} avec un style ${style}. 
    Retourne uniquement une liste de noms, un par ligne, sans numérotation ni formatage.`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.8
      })

      const content = response.choices[0]?.message?.content || ''
      return content.split('\n').filter(name => name.trim().length > 0)
    } catch (error) {
      console.error('Erreur génération IA:', error)
      throw new Error('Erreur lors de la génération des noms de marque')
    }
  }

  async generateSlogans(brandName: string, sector: string): Promise<string[]> {
    const prompt = `Génère 5 slogans accrocheurs pour la marque "${brandName}" dans le secteur ${sector}.
    Retourne uniquement une liste de slogans, un par ligne.`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      })

      const content = response.choices[0]?.message?.content || ''
      return content.split('\n').filter(slogan => slogan.trim().length > 0)
    } catch (error) {
      console.error('Erreur génération slogans:', error)
      throw new Error('Erreur lors de la génération des slogans')
    }
  }
}

export const aiService = new AIService()