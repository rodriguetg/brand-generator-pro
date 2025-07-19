'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SectorSelector } from './ui/SectorSelector'
import { StyleSelector } from './ui/StyleSelector'
import { ResultsGrid } from './ui/ResultsGrid'
import { Button } from './ui/Button'
import { GenerationResult } from '@/types'

export function BrandGenerator() {
  const { data: session } = useSession()
  const [sector, setSector] = useState('')
  const [style, setStyle] = useState('')
  const [results, setResults] = useState<GenerationResult>({
    brands: [],
    slogans: [],
    remainingCredits: 0
  })
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [isLoadingSlogans, setIsLoadingSlogans] = useState(false)

  const generateBrands = async () => {
    if (!sector || !style) {
      alert('Veuillez sélectionner un secteur et un style')
      return
    }

    setIsLoadingBrands(true)
    try {
      const response = await fetch('/api/generate/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, style })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_CREDITS') {
          alert('Crédits insuffisants. Veuillez upgrader votre plan.')
          return
        }
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setResults(prev => ({
        ...prev,
        brands: data.brands,
        slogans: [], // Reset slogans
        remainingCredits: data.remainingCredits
      }))
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération des noms de marque')
    } finally {
      setIsLoadingBrands(false)
    }
  }

  const generateSlogans = async (brandName: string) => {
    setIsLoadingSlogans(true)
    try {
      const response = await fetch('/api/generate/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, sector })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_CREDITS') {
          alert('Crédits insuffisants. Veuillez upgrader votre plan.')
          return
        }
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setResults(prev => ({
        ...prev,
        slogans: data.slogans,
        remainingCredits: data.remainingCredits
      }))
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération des slogans')
    } finally {
      setIsLoadingSlogans(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connectez-vous pour commencer
        </h2>
        <p className="text-gray-600 mb-6">
          Créez un compte gratuit pour générer vos premiers noms de marque
        </p>
        <Button onClick={() => window.location.href = '/api/auth/signin'}>
          Se connecter
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header avec crédits */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Générateur de Marques IA
        </h1>
        <p className="text-gray-600">
          Crédits restants: {results.remainingCredits >= 0 ? results.remainingCredits : 'Illimité'}
        </p>
      </div>

      {/* Formulaire de génération */}
      <div className="card space-y-6">
        <SectorSelector value={sector} onChange={setSector} />
        <StyleSelector value={style} onChange={setStyle} />
        
        <div className="flex justify-center">
          <Button
            onClick={generateBrands}
            loading={isLoadingBrands}
            disabled={!sector || !style}
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
        onGenerateSlogans={generateSlogans}
        loading={isLoadingSlogans}
      />
    </div>
  )
}