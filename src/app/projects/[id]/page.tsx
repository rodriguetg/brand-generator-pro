import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ProjectDetailClient } from '@/components/ProjectDetailClient'

interface ProjectPageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/api/auth/signin')
  }

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: user.id
    }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDetailClient project={project} />
    </div>
  )
}