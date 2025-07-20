'use client'

import { useState } from 'react'
import { Button } from './Button'
import { motion, AnimatePresence } from 'framer-motion'

interface ResultsGridProps {
  brands?: string[]
  slogans?: string[]
  onGenerateSlogans?: (brandName: string) => void
  onSaveProject?: () => void
  loading?: boolean
  sector?: string
  style?: string
  usedProvider?: string
}

export function ResultsGrid({ brands, slogans, onGenerateSlogans, loading }: ResultsGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand)
    if (onGenerateSlogans) {
      onGenerateSlogans(brand)
    }
  }

  if (!brands || brands.length === 0 && (!slogans || slogans.length === 0)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Noms de marque */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Noms de marque générés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {brands.map((brand, index) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBrand === brand
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleBrandSelect(brand)}
                >
                  <div className="font-medium text-gray-900">{brand}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Cliquez pour générer des slogans
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Slogans */}
      {slogans && slogans.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Slogans pour "{selectedBrand}"
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {slogans.map((slogan, index) => (
                <motion.div
                  key={slogan}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white border border-gray-200 hover:border-brand-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">"{slogan}"</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <span className="ml-3 text-gray-600">Génération en cours...</span>
        </div>
      )}
    </div>
  )
}