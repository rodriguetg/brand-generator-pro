'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface FavoriteButtonProps {
  projectId: string
  isFavorite: boolean
  className?: string
}

export function FavoriteButton({ projectId, isFavorite, className = '' }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite)
  const queryClient = useQueryClient()

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !favorite })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      return response.json()
    },
    onSuccess: (data) => {
      setFavorite(data.isFavorite)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      
      toast.success(
        data.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
        { duration: 2000 }
      )
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour')
    }
  })

  return (
    <button
      onClick={() => toggleFavoriteMutation.mutate()}
      disabled={toggleFavoriteMutation.isPending}
      className={`
        p-2 rounded-full transition-colors
        ${favorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        ${toggleFavoriteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        className="w-5 h-5"
        fill={favorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}