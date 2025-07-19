'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Project } from '@prisma/client'
import { Button } from './ui/Button'
import { ProjectCard } from './ui/ProjectCard'
import { StatsCard } from './ui/StatsCard'
import { motion } from 'framer-motion'

interface DashboardClientProps {
  user: User & {
    projects: Project[]
  }
}

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(user.projects)

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression du projet')
    }
  }

  const stats = {
    totalProjects: projects.length,
    totalBrands: projects.reduce((acc, p) => acc + p.brandNames.length, 0),
    totalSlogans: projects.reduce((acc, p) => acc + p.slogans.length, 0),
    creditsRemaining: user.plan === 'FREE' ? user.credits : -1
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.name || 'Utilisateur'} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos projets et générez de nouvelles marques
          </p>
        </div>
        <Button
          onClick={() => router.push('/generator')}
          size="lg"
        >
          Nouveau projet ✨
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Projets"
          value={stats.totalProjects}
          icon="📁"
          color="blue"
        />
        <StatsCard
          title="Noms générés"
          value={stats.totalBrands}
          icon="🏷️"
          color="green"
        />
        <StatsCard
          title="Slogans créés"
          value={stats.totalSlogans}
          icon="💬"
          color="purple"
        />
        <StatsCard
          title="Crédits"
          value={stats.creditsRemaining >= 0 ? stats.creditsRemaining : 'Illimité'}
          icon="⚡"
          color="orange"
        />
      </div>

      {/* Plan actuel */}
      <div className="card mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Plan actuel: {user.plan}
            </h3>
            <p className="text-gray-600">
              {user.plan === 'FREE' 
                ? `${user.credits} crédits restants`
                : 'Générations illimitées'
              }
            </p>
          </div>
          {user.plan === 'FREE' && (
            <Button
              variant="outline"
              onClick={() => router.push('/pricing')}
            >
              Upgrader 🚀
            </Button>
          )}
        </div>
      </div>

      {/* Projets récents */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Projets récents
          </h2>
          {projects.length > 0 && (
            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
            >
              Voir tout
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun projet encore
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier projet pour commencer à générer des marques
            </p>
            <Button onClick={() => router.push('/generator')}>
              Créer un projet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onDelete={() => handleDeleteProject(project.id)}
                  onEdit={() => router.push(`/projects/${project.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}