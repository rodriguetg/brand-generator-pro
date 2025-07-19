'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SectorSelector } from './ui/SectorSelector'
import { StyleSelector } from './ui/StyleSelector'
import { AIProviderSelector } from './ui/AIProviderSelector'
import { ResultsGrid } from './ui/ResultsGrid'
import { SaveProjectModal } from './ui/SaveProjectModal'
import { Button } from './ui/Button'
import { useGenerateBrands, useGenerateSlogans, useAIProviders } from '@/hooks/useGeneration'
import { AIProvider } from '@/lib/ai-providers'
import toast from 'react-hot-toast'

export function BrandGeneratorOptimized() {
  const { data: session } = useSession()
  const [sector, setSector] = useState('')
  const [style, setStyle] = useState('')
  const [aiProvider, setAiProvider] = useState<AIProvider>('openai')
  const [results, setResults] = useState({
    brands: [] as string[],
    slogans: [] as string[],
    remainingCredits: 0,
    usedProvider: 'openai' as AIProvider
  })
  const [showSaveModal, setShowSaveModal] = useState(false)

  // React Query hooks
  const generateBrandsMutation = useGenerateBrands()
  const generateSlogansMutation = useGenerateSlogans()
  const { data: availableProviders = [] } = useAIProviders()

  const handleGenerateBrands = async () => {
    if (!sector || !style) {
      toast.error('Veuillez sélectionner un secteur et un style')
      return
    }

    try {
      const data = await generateBrandsMutation.mutateAsync({
        sector,
        style,
        provider: aiProvider
      })

      setResults(prev => ({
        ...prev,
        brands: data.brands,
        slogans: [], // Reset slogans
        remainingCredits: data.remainingCredits,
        usedProvider: data.provider
      }))
    } catch (error) {
      // Erreur gérée par React Query
    }
  }

  const handleGenerateSlogans = async (brandName: string) => {
    try {
      const data = await generateSlogansMutation.mutateAsync({
        brandName,
        sector,
        provider: aiProvider
      })

      setResults(prev => ({
        ...prev,
        slogans: data.slogans,
        remainingCredits: data.remainingCredits,
        usedProvider: data.provider
      }))
    } catch (error) {
      // Erreur gérée par React Query
    }
  }

  const saveProject = async (projectName: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          sector,
          style,
          brandNames: results.brands,
          slogans: results.slogans,
          aiProvider: results.usedProvider
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      toast.success('Projet sauvegardé avec succès!')
      setShowSaveModal(false)
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du projet')
    }
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connectez-vous pour générer des marques
        </h2>
        <p className="text-gray-600 mb-8">
          Accédez à notre générateur IA et créez des noms de marques uniques
        </p>
        <Button onClick={() => window.location.href = '/api/auth/signin'}>
          Se connecter
        </Button>
      </div>
    )
  }

  const isLoading = generateBrandsMutation.isPending || generateSlogansMutation.isPending

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header avec crédits */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Générateur de Marques IA
        </h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>
            Crédits: {results.remainingCredits >= 0 ? results.remainingCredits : 'Illimité'}
          </span>
          {results.usedProvider && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              IA: {results.usedProvider.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Formulaire de génération */}
      <div className="card space-y-6">
        <SectorSelector value={sector} onChange={setSector} />
        <StyleSelector value={style} onChange={setStyle} />
        <AIProviderSelector 
          value={aiProvider} 
          onChange={setAiProvider}
          disabled={isLoading}
        />
        
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateBrands}
            loading={generateBrandsMutation.isPending}
            disabled={!sector || !style || isLoading}
            size="lg"
          >
            Générer des noms de marque
          </Button>
        </div>
      </div>

      {/* Résultats */}
      <ResultsGrid
        brands={results.brands}
        slogans={results.slogans}
        onGenerateSlogans={handleGenerateSlogans}
        onSaveProject={() => setShowSaveModal(true)}
        loading={generateSlogansMutation.isPending}
        sector={sector}
        style={style}
        usedProvider={results.usedProvider}
      />

      {/* Modal de sauvegarde */}
      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveProject}
        brands={results.brands}
        slogans={results.slogans}
        sector={sector}
        style={style}
      />
    </div>
  )
}