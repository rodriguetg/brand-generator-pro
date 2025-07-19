'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { AIProvider } from '@/lib/ai-providers'
import toast from 'react-hot-toast'

interface GenerateBrandsParams {
  sector: string
  style: string
  provider: AIProvider
}

interface GenerateSlogansParams {
  brandName: string
  sector: string
  provider: AIProvider
}

export function useGenerateBrands() {
  return useMutation({
    mutationFn: async ({ sector, style, provider }: GenerateBrandsParams) => {
      const response = await fetch('/api/generate/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, style, provider })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_CREDITS') {
          throw new Error('Crédits insuffisants')
        }
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success(`${data.brands.length} noms générés avec ${data.provider.toUpperCase()}!`)
    },
    onError: (error: Error) => {
      if (error.message === 'Crédits insuffisants') {
        toast.error('Crédits insuffisants. Upgradez votre plan!', {
          duration: 6000,
        })
      } else {
        toast.error('Erreur lors de la génération')
      }
    }
  })
}

export function useGenerateSlogans() {
  return useMutation({
    mutationFn: async ({ brandName, sector, provider }: GenerateSlogansParams) => {
      const response = await fetch('/api/generate/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, sector, provider })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_CREDITS') {
          throw new Error('Crédits insuffisants')
        }
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success(`${data.slogans.length} slogans générés!`)
    },
    onError: (error: Error) => {
      if (error.message === 'Crédits insuffisants') {
        toast.error('Crédits insuffisants. Upgradez votre plan!')
      } else {
        toast.error('Erreur lors de la génération des slogans')
      }
    }
  })
}

export function useAIProviders() {
  return useQuery({
    queryKey: ['ai-providers'],
    queryFn: async () => {
      const response = await fetch('/api/ai/providers')
      const data = await response.json()
      return data.providers || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}