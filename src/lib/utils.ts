import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SECTORS = [
  { value: 'tech', label: 'Technologie', icon: '💻' },
  { value: 'fashion', label: 'Mode', icon: '👗' },
  { value: 'food', label: 'Alimentation', icon: '🍕' },
  { value: 'health', label: 'Santé', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'education', label: 'Éducation', icon: '📚' },
  { value: 'travel', label: 'Voyage', icon: '✈️' },
  { value: 'beauty', label: 'Beauté', icon: '💄' },
  { value: 'sports', label: 'Sport', icon: '⚽' },
  { value: 'real-estate', label: 'Immobilier', icon: '🏠' }
]

export const STYLES = [
  { value: 'modern', label: 'Moderne', description: 'Clean, minimaliste, contemporain' },
  { value: 'creative', label: 'Créatif', description: 'Artistique, original, innovant' },
  { value: 'professional', label: 'Professionnel', description: 'Sérieux, corporate, fiable' },
  { value: 'playful', label: 'Ludique', description: 'Amusant, décontracté, accessible' },
  { value: 'luxury', label: 'Luxe', description: 'Premium, élégant, exclusif' },
  { value: 'eco', label: 'Écologique', description: 'Naturel, durable, responsable' }
]

export const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    credits: 3,
    features: ['3 générations/jour', 'Aperçu basique', '3 styles disponibles']
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    credits: -1,
    features: ['Générations illimitées', 'Tous styles', 'Export HD', 'Mock-ups'],
    popular: true
  },
  AGENCY: {
    name: 'Agency',
    price: 29.99,
    credits: -1,
    features: ['Multi-clients', 'White-label', 'API access', 'Support prioritaire']
  }
}