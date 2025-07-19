'use client'

import { useState } from 'react'
import { Button } from './Button'
import { pdfExportService } from '@/lib/pdf-export'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  project?: {
    name: string
    sector: string
    style: string
    brandNames: string[]
    slogans: string[]
    createdAt: Date
  }
  projects?: any[]
  variant?: 'single' | 'multiple'
  className?: string
}

export function ExportButton({ 
  project, 
  projects, 
  variant = 'single',
  className = '' 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      let blob: Blob
      let filename: string

      if (variant === 'single' && project) {
        blob = await pdfExportService.exportProject(project)
        filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      } else if (variant === 'multiple' && projects) {
        blob = await pdfExportService.exportMultipleProjects(projects)
        filename = `projets_${new Date().toISOString().split('T')[0]}.pdf`
      } else {
        throw new Error('Données manquantes pour l\'export')
      }

      // Télécharger le fichier
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('PDF exporté avec succès!')
    } catch (error) {
      console.error('Erreur export PDF:', error)
      toast.error('Erreur lors de l\'export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      loading={isExporting}
      variant="outline"
      className={className}
      disabled={
        (variant === 'single' && !project) || 
        (variant === 'multiple' && (!projects || projects.length === 0))
      }
    >
      <span className="mr-2">📄</span>
      {isExporting ? 'Export en cours...' : 'Exporter PDF'}
    </Button>
  )
}