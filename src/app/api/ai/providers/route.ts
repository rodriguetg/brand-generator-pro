import { NextResponse } from 'next/server'
import { aiService } from '@/lib/ai'

export async function GET() {
  try {
    const providers = await aiService.getAvailableProviders()
    
    return NextResponse.json({
      providers,
      count: providers.length
    })
  } catch (error) {
    console.error('Erreur vérification providers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des providers' },
      { status: 500 }
    )
  }
}