import { prisma } from './db'

export async function checkAndDecrementCredits(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  // Plans payants = crédits illimités
  if (user.plan !== 'FREE') {
    return true
  }

  // Plan gratuit = vérifier les crédits
  if (user.credits <= 0) {
    return false
  }

  // Décrémenter les crédits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: user.credits - 1 }
  })

  return true
}

export async function getRemainingCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }

  return user.plan === 'FREE' ? user.credits : -1 // -1 = illimité
}