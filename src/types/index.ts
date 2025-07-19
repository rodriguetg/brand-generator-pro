import { User, Project, Plan } from '@prisma/client'

export type { User, Project, Plan }

export interface GenerationResult {
  brands?: string[]
  slogans?: string[]
  remainingCredits: number
}

export interface SectorOption {
  value: string
  label: string
  icon?: string
}

export interface StyleOption {
  value: string
  label: string
  description?: string
}

export interface PlanFeature {
  name: string
  price: number
  credits: number
  features: string[]
  popular?: boolean
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      plan: Plan
      credits: number
    }
  }
}