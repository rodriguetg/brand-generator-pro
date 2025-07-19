'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function SuccessNotification() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)
  
  const success = searchParams.get('success')
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (success === 'true' && plan) {
      setShow(true)
      
      // Masquer après 5 secondes
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [success, plan])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <h3 className="font-semibold">Abonnement activé !</h3>
              <p className="text-sm opacity-90">
                Bienvenue dans le plan {plan}. Profitez de toutes les fonctionnalités !
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="ml-3 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}