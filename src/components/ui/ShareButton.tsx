'use client'

import { useState } from 'react'
import { Button } from './Button'
import toast from 'react-hot-toast'

interface ShareButtonProps {
  project: {
    id: string
    name: string
    brandNames: string[]
    slogans: string[]
  }
  className?: string
}

export function ShareButton({ project, className = '' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const generateShareableLink = async () => {
    setIsSharing(true)
    
    try {
      const response = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du lien')
      }

      const { shareId } = await response.json()
      const shareUrl = `${window.location.origin}/share/${shareId}`

      // Copier dans le presse-papier
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papier!')
      
      setShowShareModal(true)
    } catch (error) {
      console.error('Erreur partage:', error)
      toast.error('Erreur lors de la création du lien de partage')
    } finally {
      setIsSharing(false)
    }
  }

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const text = `Découvrez mon projet "${project.name}" créé avec Brand Generator Pro!`
    const url = `${window.location.origin}/share/${project.id}`
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <>
      <Button
        onClick={generateShareableLink}
        loading={isSharing}
        variant="outline"
        className={className}
      >
        <span className="mr-2">🔗</span>
        Partager
      </Button>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Partager le projet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien de partage
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={`${window.location.origin}/share/${project.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/share/${project.id}`)
                      toast.success('Copié!')
                    }}
                    className="px-3 py-2 bg-brand-500 text-white rounded-r-md hover:bg-brand-600"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partager sur les réseaux sociaux
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="flex-1 bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => shareToSocial('linkedin')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="flex-1 bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}