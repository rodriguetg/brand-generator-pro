'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { User } from '@prisma/client'
import { Button } from './ui/Button'
import { PLANS } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PricingClientProps {
  user: User | null
}

export function PricingClient({ user }: PricingClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const canceled = searchParams.get('canceled')

  const handleSubscribe = async (planId: 'PRO' | 'AGENCY') => {
    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la redirection vers le paiement')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du portail')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ouverture du portail client')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Débloquez tout le potentiel de Brand Generator Pro avec nos plans flexibles
        </p>
        
        {canceled && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-800">
              ⚠️ Paiement annulé. Vous pouvez réessayer quand vous voulez.
            </p>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {Object.entries(PLANS).map(([key, plan], index) => {
          const isCurrentPlan = user?.plan === key
          const isPro = key === 'PRO'
          const isAgency = key === 'AGENCY'
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative card ${
                plan.popular ? 'ring-2 ring-brand-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    ⭐ Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                </div>
                {plan.price > 0 && (
                  <div className="text-gray-600">par mois</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {isCurrentPlan ? (
                  <div className="text-center">
                    <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg mb-3">
                      ✓ Plan actuel
                    </div>
                    {user?.plan !== 'FREE' && (
                      <Button
                        variant="outline"
                        onClick={handleManageSubscription}
                        className="w-full"
                      >
                        Gérer l'abonnement
                      </Button>
                    )}
                  </div>
                ) : key === 'FREE' ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/generator')}
                    className="w-full"
                  >
                    Commencer gratuitement
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(key as 'PRO' | 'AGENCY')}
                    loading={loadingPlan === key}
                    disabled={!!loadingPlan}
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                  >
                    {session ? 'S\'abonner' : 'Se connecter pour s\'abonner'}
                  </Button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Questions fréquentes
        </h2>
        
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              Puis-je changer de plan à tout moment ?
            </h3>
            <p className="text-gray-600">
              Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
              Les changements prennent effet immédiatement.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              Que se passe-t-il si j'annule mon abonnement ?
            </h3>
            <p className="text-gray-600">
              Vous gardez l'accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation, 
              puis vous revenez automatiquement au plan gratuit.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              Y a-t-il une garantie de remboursement ?
            </h3>
            <p className="text-gray-600">
              Oui, nous offrons une garantie de remboursement de 14 jours sans questions posées.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              Les prix incluent-ils la TVA ?
            </h3>
            <p className="text-gray-600">
              Les prix affichés sont hors taxes. La TVA sera ajoutée lors du paiement selon votre localisation.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Prêt à créer votre marque parfaite ?
        </h2>
        <Button
          onClick={() => router.push('/generator')}
          size="lg"
        >
          Commencer maintenant
        </Button>
      </div>
    </div>
  )
}