'use client'

import { useState, useEffect } from 'react'
import { AIProvider } from '@/lib/ai-providers'

interface AIProviderSelectorProps {
  value: AIProvider
  onChange: (provider: AIProvider) => void
  disabled?: boolean
}

const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI GPT-4',
    description: 'Le plus créatif et polyvalent',
    icon: '🤖',
    color: 'bg-green-100 text-green-800'
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Rapide et efficace',
    icon: '⚡',
    color: 'bg-blue-100 text-blue-800'
  },
  deepseek: {
    name: 'DeepSeek',
    description: 'Économique et performant',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-800'
  }
}

export function AIProviderSelector({ value, onChange, disabled }: AIProviderSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>(['openai'])

  useEffect(() => {
    // Vérifier les providers disponibles
    fetch('/api/ai/providers')
      .then(res => res.json())
      .then(data => {
        if (data.providers) {
          setAvailableProviders(data.providers)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Moteur IA
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(PROVIDER_INFO).map(([provider, info]) => {
          const isAvailable = availableProviders.includes(provider as AIProvider)
          const isSelected = value === provider
          
          return (
            <button
              key={provider}
              type="button"
              disabled={disabled || !isAvailable}
              onClick={() => onChange(provider as AIProvider)}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${isSelected 
                  ? 'border-brand-500 bg-brand-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{info.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {info.name}
                    </h3>
                    {!isAvailable && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Indisponible
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {info.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      <p className="text-xs text-gray-500">
        💡 Chaque IA a ses propres forces. Testez-les pour trouver votre préférée !
      </p>
    </div>
  )
}