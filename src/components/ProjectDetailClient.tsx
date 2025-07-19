'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@prisma/client'
import { Button } from './ui/Button'
import { BrandPreview } from './ui/BrandPreview'
import { motion } from 'framer-motion'

interface ProjectDetailClientProps {
  project: Project
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState(project.brandNames[0] || '')
  const [selectedSlogan, setSelectedSlogan] = useState(project.slogans[0] || '')
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(project.name)

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const exportData = () => {
    const data = {
      nom: project.name,
      secteur: project.sector,
      style: project.style,
      noms_de_marque: project.brandNames,
      slogans: project.slogans,
      date_creation: project.createdAt
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Retour
          </Button>
          
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-brand-500 focus:outline-none"
              />
              <Button onClick={handleSaveEdit} size="sm">
                ✓
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                size="sm"
              >
                ✕
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                size="sm"
              >
                ✏️
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>📅 {new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
            <span>🏢 {project.sector}</span>
            <span>🎨 {project.style}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={exportData}
          >
            Exporter 📥
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50"
          >
            Supprimer 🗑️
          </Button>
        </div>
      </div>

      {/* Aperçu visuel */}
      {selectedBrand && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aperçu de "{selectedBrand}"
          </h2>
          <BrandPreview
            brandName={selectedBrand}
            slogan={selectedSlogan}
            sector={project.sector}
            style={project.style}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Noms de marque */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Noms de marque ({project.brandNames.length})
          </h2>
          
          {project.brandNames.length === 0 ? (
            <p className="text-gray-600">Aucun nom de marque généré</p>
          ) : (
            <div className="space-y-2">
              {project.brandNames.map((brand, index) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBrand === brand
                      ? 'bg-brand-50 border-2 border-brand-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="font-medium text-gray-900">{brand}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Slogans */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Slogans ({project.slogans.length})
          </h2>
          
          {project.slogans.length === 0 ? (
            <p className="text-gray-600">Aucun slogan généré</p>
          ) : (
            <div className="space-y-2">
              {project.slogans.map((slogan, index) => (
                <motion.div
                  key={slogan}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSlogan === slogan
                      ? 'bg-brand-50 border-2 border-brand-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedSlogan(slogan)}
                >
                  <div className="text-gray-900">"{slogan}"</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 text-center">
        <Button
          onClick={() => router.push('/generator')}
          size="lg"
        >
          Créer un nouveau projet ✨
        </Button>
      </div>
    </div>
  )
}