import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ProjectsListClient } from '@/components/ProjectsListClient'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectsListClient projects={user.projects} />
    </div>
  )
}