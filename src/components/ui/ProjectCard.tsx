'use client'

import { Project } from '@prisma/client'
import { Button } from './Button'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectCardProps {
  project: Project
  onDelete: () => void
  onEdit: () => void
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: fr 
    })
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(project.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-brand-600 transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Secteur:</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
            {project.sector}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Style:</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
            {project.style}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {project.brandNames.length}
            </div>
            <div className="text-xs text-gray-600">Noms</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {project.slogans.length}
            </div>
            <div className="text-xs text-gray-600">Slogans</div>
          </div>
        </div>

        {project.brandNames.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-2">Aperçu:</p>
            <div className="text-sm text-gray-900 font-medium">
              {project.brandNames.slice(0, 3).join(', ')}
              {project.brandNames.length > 3 && '...'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={onEdit}
          className="w-full"
        >
          Voir le projet
        </Button>
      </div>
    </div>
  )
}