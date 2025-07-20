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
  const [visitorUsage, setVisitorUsage] = useState(0)
  const maxVisitorUsage = 2 // Limite pour les visiteurs

  const generateBrands = async () => {
    if (!sector || !style) {
      alert('Veuillez sélectionner un secteur et un style')
      return
    }

    // Vérifier la limite pour les visiteurs
    if (!session && visitorUsage >= maxVisitorUsage) {
      alert('Vous avez atteint la limite d\'essai gratuit. Inscrivez-vous pour continuer !')
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

      // Incrémenter l'usage pour les visiteurs
      if (!session) {
        setVisitorUsage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération des noms de marque')
    } finally {
      setIsLoadingBrands(false)
    }
  }

  const generateSlogans = async (brandName: string) => {
    // Vérifier la limite pour les visiteurs
    if (!session && visitorUsage >= maxVisitorUsage) {
      alert('Vous avez atteint la limite d\'essai gratuit. Inscrivez-vous pour continuer !')
      return
    }

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

      // Incrémenter l'usage pour les visiteurs
      if (!session) {
        setVisitorUsage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération des slogans')
    } finally {
      setIsLoadingSlogans(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header avec crédits/limite */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Générateur de Marques IA
        </h1>
        {session ? (
          <p className="text-gray-600">
            Crédits restants: {results.remainingCredits >= 0 ? results.remainingCredits : 'Illimité'}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              Essai gratuit: {visitorUsage}/{maxVisitorUsage} utilisations
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                💡 Inscrivez-vous gratuitement pour plus de générations et sauvegarder vos projets !
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de génération */}
      <div className="card space-y-6">
        <SectorSelector value={sector} onChange={setSector} />
        <StyleSelector value={style} onChange={setStyle} />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={generateBrands}
            loading={isLoadingBrands}
            disabled={!sector || !style || (!session && visitorUsage >= maxVisitorUsage)}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            {!session && visitorUsage >= maxVisitorUsage 
              ? 'Limite atteinte' 
              : 'Générer des noms de marque'
            }
          </Button>
          
          {!session && (
            <Button
              onClick={() => window.location.href = '/api/auth/signin'}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              S'inscrire gratuitement
            </Button>
          )}
        </div>
      </div>

      {/* Résultats */}
      <ResultsGrid
        brands={results.brands}
        slogans={results.slogans}
        onGenerateSlogans={generateSlogans}
        loading={isLoadingSlogans}
      />

      {/* Call-to-action pour les visiteurs */}
      {!session && results.brands && results.brands.length > 0 && (
        <div className="card bg-gradient-to-r from-brand-50 to-blue-50 border-brand-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎉 Vous aimez les résultats ?
            </h3>
            <p className="text-gray-600 mb-4">
              Créez un compte gratuit pour sauvegarder vos projets et générer plus de noms !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.href = '/api/auth/signin'}
                size="lg"
              >
                Créer un compte gratuit
              </Button>
              <Button
                onClick={() => window.location.href = '/pricing'}
                variant="outline"
                size="lg"
              >
                Voir les plans premium
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}