'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface BrandPreviewProps {
  brandName: string
  slogan?: string
  sector: string
  style: string
}

const colorSchemes = {
  modern: { bg: 'bg-gray-900', text: 'text-white', accent: 'bg-blue-500' },
  creative: { bg: 'bg-purple-600', text: 'text-white', accent: 'bg-yellow-400' },
  professional: { bg: 'bg-blue-900', text: 'text-white', accent: 'bg-blue-400' },
  playful: { bg: 'bg-pink-500', text: 'text-white', accent: 'bg-orange-400' },
  luxury: { bg: 'bg-black', text: 'text-white', accent: 'bg-gold-400' },
  eco: { bg: 'bg-green-700', text: 'text-white', accent: 'bg-green-400' }
}

const mockupTypes = [
  { id: 'logo', name: 'Logo', icon: '🎨' },
  { id: 'business-card', name: 'Carte de visite', icon: '💳' },
  { id: 'website', name: 'Site web', icon: '💻' },
  { id: 'social', name: 'Réseaux sociaux', icon: '📱' }
]

export function BrandPreview({ brandName, slogan, sector, style }: BrandPreviewProps) {
  const [selectedMockup, setSelectedMockup] = useState('logo')
  const colors = colorSchemes[style as keyof typeof colorSchemes] || colorSchemes.modern

  const renderMockup = () => {
    switch (selectedMockup) {
      case 'logo':
        return (
          <div className={`${colors.bg} ${colors.text} p-8 rounded-lg flex flex-col items-center justify-center h-64`}>
            <div className={`w-12 h-12 ${colors.accent} rounded-full mb-4`}></div>
            <h2 className="text-2xl font-bold mb-2">{brandName}</h2>
            {slogan && <p className="text-sm opacity-80">{slogan}</p>}
          </div>
        )
      
      case 'business-card':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 h-64 flex flex-col justify-between shadow-lg">
            <div>
              <div className={`w-8 h-8 ${colors.accent} rounded mb-3`}></div>
              <h3 className="text-lg font-bold text-gray-900">{brandName}</h3>
              {slogan && <p className="text-xs text-gray-600 mt-1">{slogan}</p>}
            </div>
            <div className="text-xs text-gray-500">
              <p>contact@{brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
        )
      
      case 'website':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-64">
            <div className={`${colors.bg} ${colors.text} p-4 flex items-center justify-between`}>
              <h3 className="font-bold">{brandName}</h3>
              <div className="flex space-x-4 text-sm">
                <span>Accueil</span>
                <span>Services</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{brandName}</h2>
              {slogan && <p className="text-gray-600 mb-4">{slogan}</p>}
              <div className={`${colors.accent} text-white px-4 py-2 rounded text-sm inline-block`}>
                En savoir plus
              </div>
            </div>
          </div>
        )
      
      case 'social':
        return (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 h-64">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 ${colors.accent} rounded-full mr-3`}></div>
              <div>
                <h4 className="font-bold text-gray-900">{brandName}</h4>
                <p className="text-xs text-gray-500">@{brandName.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
            {slogan && (
              <p className="text-gray-700 mb-4">"{slogan}" 🚀</p>
            )}
            <div className="flex space-x-4 text-xs text-gray-500">
              <span>❤️ 1.2k</span>
              <span>💬 89</span>
              <span>🔄 234</span>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {mockupTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedMockup(type.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedMockup === type.id
                ? 'bg-brand-100 text-brand-700 border-2 border-brand-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.name}</span>
          </button>
        ))}
      </div>
      
      <motion.div
        key={selectedMockup}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderMockup()}
      </motion.div>
    </div>
  )
}