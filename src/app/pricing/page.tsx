import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PricingClient } from '@/components/PricingClient'

export default async function PricingPage() {
  const session = await getServerSession(authOptions)
  
  let user = null
  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PricingClient user={user} />
    </div>
  )
}