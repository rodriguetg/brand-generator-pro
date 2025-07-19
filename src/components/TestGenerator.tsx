'use client'

import { useState } from 'react'
import { Button } from './ui/Button'

export function TestGenerator() {
  const [sector, setSector] = useState('')
  const [style, setStyle] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sectors = [
    'tech', 'fashion', 'food', 'health', 'finance', 'education'
  ]

  const styles = [
    'moderne', 'créatif', 'professionnel', 'luxe', 'minimaliste', 'dynamique'
  ]

  const generateBrands = async () => {
    if (!sector || !style) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, style, provider: 'openai' })
      })

      if (!response.ok) {
        throw new Error('Erreur génération')
      }

      const data = await response.json()
      setResults(data.brands || [])
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Brand Generator Pro
        </h1>
        <p className="text-xl text-gray-600">
          Version de test - Générateur de noms de marque avec IA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélecteur de secteur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secteur d'activité
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Choisir un secteur</option>
              {sectors.map(s => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>

          {/* Sélecteur de style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style souhaité
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Choisir un style</option>
              {styles.map(s => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={generateBrands}
            loading={isLoading}
            disabled={!sector || !style}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? 'Génération en cours...' : 'Générer des noms de marque'}
          </Button>
        </div>
      </div>

      {/* Résultats */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Noms de marque générés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((brand, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-brand-500 transition-colors"
              >
                <div className="font-semibold text-lg text-gray-900">
                  {brand}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {sector} • {style}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer simple */}
      <div className="text-center text-gray-500 text-sm">
        <p>Version de test • Powered by OpenAI</p>
      </div>
    </div>
  )
}