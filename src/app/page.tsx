import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      {/* Navigation avec inscription */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Brand Generator Pro
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/generator" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Générateur
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tarifs
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/api/auth/signin">
                <Button variant="outline" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button size="sm">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Générez des noms de marques uniques en quelques secondes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Testez notre générateur IA gratuitement. Créez des noms de marques et slogans 
            créatifs pour votre entreprise, sans inscription requise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/generator">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                🚀 Essayer gratuitement
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                Voir les tarifs
              </Button>
            </Link>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">10,000+</div>
              <div className="text-gray-600">Noms générés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">500+</div>
              <div className="text-gray-600">Utilisateurs satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">15+</div>
              <div className="text-gray-600">Secteurs d'activité</div>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">IA Multi-Fournisseurs</h3>
              <p className="text-gray-600">
                OpenAI, Google Gemini et Deepseek pour des résultats variés et créatifs
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Résultats instantanés</h3>
              <p className="text-gray-600">
                Obtenez 6 suggestions en quelques secondes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Personnalisé</h3>
              <p className="text-gray-600">
                Adapté à votre secteur et style de marque
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}