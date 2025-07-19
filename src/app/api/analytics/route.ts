import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Calculer la date de début selon la période
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Récupérer les projets de l'utilisateur
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculer les statistiques
    const totalProjects = projects.length
    const totalGenerations = projects.reduce((acc, project) => {
      return acc + (project.brandNames?.length || 0) + (project.slogans?.length || 0)
    }, 0)

    // Statistiques par secteur
    const sectorCounts = projects.reduce((acc, project) => {
      acc[project.sector] = (acc[project.sector] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sectorStats = Object.entries(sectorCounts)
      .map(([sector, count]) => ({
        sector,
        count,
        percentage: Math.round((count / totalProjects) * 100)
      }))
      .sort((a, b) => b.count - a.count)

    // Statistiques par provider IA (simulé pour l'exemple)
    const providerStats = [
      { provider: 'openai', count: Math.floor(totalGenerations * 0.6), percentage: 60 },
      { provider: 'gemini', count: Math.floor(totalGenerations * 0.25), percentage: 25 },
      { provider: 'deepseek', count: Math.floor(totalGenerations * 0.15), percentage: 15 }
    ]

    // Activité quotidienne
    const dailyStats = []
    for (let i = parseInt(period); i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      
      const dayProjects = projects.filter(project => {
        const projectDate = new Date(project.createdAt)
        return projectDate.toDateString() === date.toDateString()
      })
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        generations: dayProjects.length
      })
    }

    // Métriques du mois en cours
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthProjects = await prisma.project.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthStart
        }
      }
    })

    const analytics = {
      totalGenerations,
      totalProjects,
      favoriteProvider: providerStats[0]?.provider || 'openai',
      topSector: sectorStats[0]?.sector || 'tech',
      generationsThisMonth: monthProjects,
      creditsUsed: user.plan === 'FREE' ? (3 - user.credits) : totalGenerations,
      dailyStats,
      sectorStats,
      providerStats
    }

    return NextResponse.json(analytics)
    
  } catch (error) {
    console.error('Erreur analytics:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}