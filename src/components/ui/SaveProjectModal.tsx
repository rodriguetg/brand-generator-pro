'use client'

import { useState } from 'react'
import { Button } from './Button'
import { motion, AnimatePresence } from 'framer-motion'

interface SaveProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (projectName: string) => void
  brands: string[]
  slogans: string[]
  sector: string
  style: string
}

export function SaveProjectModal({ 
  isOpen, 
  onClose, 
  onSave, 
  brands, 
  slogans, 
  sector, 
  style 
}: SaveProjectModalProps) {
  const [projectName, setProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('Veuillez entrer un nom de projet')
      return
    }

    setIsLoading(true)
    try {
      await onSave(projectName.trim())
      setProjectName('')
      onClose()
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sauvegarder le projet
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Mon projet de marque"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Secteur:</strong> {sector}</p>
                <p><strong>Style:</strong> {style}</p>
                <p><strong>Noms générés:</strong> {brands.length}</p>
                <p><strong>Slogans générés:</strong> {slogans.length}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                loading={isLoading}
              >
                Sauvegarder
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}