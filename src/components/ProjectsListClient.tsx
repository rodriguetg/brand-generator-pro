'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@prisma/client'
import { Button } from './ui/Button'
import { ProjectCard } from './ui/ProjectCard'
import { motion } from 'framer-motion'

interface ProjectsListClientProps {
  projects: Project[]
}

export function ProjectsListClient({ projects: initialProjects }: ProjectsListClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSector, setFilterSector] = useState('')

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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.brandNames.some(brand => 
                           brand.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesSector = !filterSector || project.sector === filterSector
    return matchesSearch && matchesSector
  })

  const sectors = [...new Set(projects.map(p => p.sector))]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes Projets ({projects.length})
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos projets de marques
          </p>
        </div>
        <Button
          onClick={() => router.push('/generator')}
          size="lg"
        >
          Nouveau projet ✨
        </Button>
      </div>

      {/* Filtres */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom du projet ou marque..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secteur
            </label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Tous les secteurs</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 card">
          <div className="text-6xl mb-4">
            {searchTerm || filterSector ? '🔍' : '🎨'}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterSector 
              ? 'Aucun projet trouvé'
              : 'Aucun projet encore'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterSector
              ? 'Essayez de modifier vos critères de recherche'
              : 'Créez votre premier projet pour commencer'
            }
          </p>
          <Button onClick={() => router.push('/generator')}>
            Créer un projet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
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
  )
}