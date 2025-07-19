import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { z } from 'zod'

const sloganSchema = z.object({
  brandName: z.string().min(1, 'Le nom de marque est requis'),
  sector: z.string().min(1, 'Le secteur est requis')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { brandName, sector } = sloganSchema.parse(body)

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

    const slogans = await aiService.generateSlogans(brandName, sector)

    if (user.plan === 'FREE') {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: user.credits - 1 }
      })
    }

    return NextResponse.json({ 
      slogans,
      remainingCredits: user.plan === 'FREE' ? user.credits - 1 : -1
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