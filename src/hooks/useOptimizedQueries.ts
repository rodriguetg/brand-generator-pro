'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AIProvider } from '@/lib/ai-providers'

// Clés de requêtes centralisées
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  userStats: ['user-stats'] as const,
  aiProviders: ['ai-providers'] as const,
  generations: ['generations'] as const,
  analytics: (period: string) => ['analytics', period] as const,
}

// Hook pour les projets avec pagination
export function useProjects(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...queryKeys.projects, page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/projects?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error('Erreur chargement projets')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour les statistiques utilisateur
export function useUserStats() {
  return useQuery({
    queryKey: queryKeys.userStats,
    queryFn: async () => {
      const response = await fetch('/api/user/stats')
      if (!response.ok) throw new Error('Erreur chargement stats')
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Actualiser toutes les 5 minutes
  })
}

// Hook pour la génération optimisée avec cache
export function useOptimizedGeneration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      type, 
      sector, 
      style, 
      brandName, 
      provider 
    }: {
      type: 'brands' | 'slogans'
      sector: string
      style: string
      brandName?: string
      provider: AIProvider
    }) => {
      const endpoint = type === 'brands' ? '/api/generate/brands' : '/api/generate/slogans'
      const body = type === 'brands' 
        ? { sector, style, provider }
        : { brandName, sector, provider }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur génération')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le cache des statistiques
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats })
      
      // Mettre à jour le cache des générations
      queryClient.setQueryData(queryKeys.generations, (old: any) => {
        return {
          ...old,
          lastGeneration: {
            type: variables.type,
            result: data,
            timestamp: Date.now()
          }
        }
      })
    }
  })
}

// Hook pour précharger les données
export function usePrefetchData() {
  const queryClient = useQueryClient()

  const prefetchProjects = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects,
      queryFn: async () => {
        const response = await fetch('/api/projects?page=1&limit=10')
        return response.json()
      },
      staleTime: 5 * 60 * 1000,
    })
  }

  const prefetchUserStats = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.userStats,
      queryFn: async () => {
        const response = await fetch('/api/user/stats')
        return response.json()
      },
      staleTime: 2 * 60 * 1000,
    })
  }

  return { prefetchProjects, prefetchUserStats }
}