import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { multiAIService } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { sector, style, provider = 'openai' } = await request.json()
    
    if (!sector || !style) {
      return NextResponse.json(
        { error: 'Secteur et style requis' },
        { status: 400 }
      )
    }

    // Pour les visiteurs, utiliser OpenAI par défaut
    const aiProvider = session ? provider : 'openai'

    // Générer les noms de marque
    const brands = await multiAIService.generateBrandNames(sector, style, aiProvider)

    return NextResponse.json({ 
      brands,
      sector,
      style,
      provider: aiProvider,
      remainingCredits: session ? -1 : 0 // -1 = illimité pour les utilisateurs connectés
    })
    
  } catch (error) {
    console.error('Erreur génération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

