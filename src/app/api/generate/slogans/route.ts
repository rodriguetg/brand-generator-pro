import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { multiAIService, AIProvider } from '@/lib/ai-providers'
import { z } from 'zod'

const sloganSchema = z.object({
  brandName: z.string().min(1, 'Le nom de marque est requis'),
  sector: z.string().min(1, 'Le secteur est requis'),
  provider: z.enum(['openai', 'gemini', 'deepseek']).optional().default('openai')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { brandName, sector, provider = 'openai' } = sloganSchema.parse(body)

    // Pour les visiteurs, utiliser OpenAI par défaut
    const aiProvider: AIProvider = session ? (provider as AIProvider) : 'openai'

    // Vérifier les crédits pour les utilisateurs connectés
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
      }

      if (user.plan === 'FREE' && user.credits <= 0) {
        return NextResponse.json({ 
          error: 'Crédits insuffisants',
          code: 'INSUFFICIENT_CREDITS'
        }, { status: 402 })
      }

      // Décrémenter les crédits pour les utilisateurs gratuits
      if (user.plan === 'FREE') {
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: user.credits - 1 }
        })
      }
    }

    // Générer les slogans
    const slogans = await multiAIService.generateSlogans(brandName, sector, aiProvider)

    return NextResponse.json({ 
      slogans,
      provider: aiProvider,
      remainingCredits: session ? -1 : 0 // -1 = illimité pour les utilisateurs connectés
    })

  } catch (error) {
    console.error('Erreur génération slogans:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Données invalides',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Erreur interne du serveur' 
    }, { status: 500 })
  }
}