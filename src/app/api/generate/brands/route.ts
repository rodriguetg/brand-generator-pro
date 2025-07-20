import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { sector, style } = await request.json()
    
    if (!sector || !style) {
      return NextResponse.json(
        { error: 'Secteur et style requis' },
        { status: 400 }
      )
    }

    // Prompt optimisé pour test
    const prompt = `Génère 6 noms de marque créatifs et mémorables pour le secteur "${sector}" avec un style "${style}".

Critères:
- Noms courts (2-3 mots max)
- Faciles à prononcer
- Modernes et accrocheurs
- Adaptés au secteur ${sector}
- Style ${style}

Format: liste simple, un nom par ligne, sans numérotation.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
    })

    const content = completion.choices[0]?.message?.content || ''
    const brands = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(brand => brand.length > 0)
      .slice(0, 6)

    return NextResponse.json({ 
      brands,
      sector,
      style,
      provider: 'openai'
    })
    
  } catch (error) {
    console.error('Erreur génération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

