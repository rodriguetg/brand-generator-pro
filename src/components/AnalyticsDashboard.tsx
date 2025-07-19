'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface AnalyticsData {
  totalGenerations: number
  totalProjects: number
  favoriteProvider: string
  topSector: string
  generationsThisMonth: number
  creditsUsed: number
  dailyStats: Array<{
    date: string
    generations: number
  }>
  sectorStats: Array<{
    sector: string
    count: number
    percentage: number
  }>
  providerStats: Array<{
    provider: string
    count: number
    percentage: number
  }>
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: async (): Promise<AnalyticsData> => {
      const response = await fetch(`/api/analytics?period=${period}`)
      if (!response.ok) throw new Error('Erreur chargement analytics')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-sm ${
                period === p
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '90 jours'}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Générations totales"
          value={analytics.totalGenerations}
          icon="🚀"
          color="bg-blue-500"
        />
        <MetricCard
          title="Projets créés"
          value={analytics.totalProjects}
          icon="📁"
          color="bg-green-500"
        />
        <MetricCard
          title="Ce mois"
          value={analytics.generationsThisMonth}
          icon="📈"
          color="bg-purple-500"
        />
        <MetricCard
          title="Crédits utilisés"
          value={analytics.creditsUsed}
          icon="⚡"
          color="bg-orange-500"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques par secteur */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Secteurs populaires</h3>
          <div className="space-y-3">
            {analytics.sectorStats.map((stat) => (
              <div key={stat.sector} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{stat.sector}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques par provider IA */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Providers IA utilisés</h3>
          <div className="space-y-3">
            {analytics.providerStats.map((stat) => (
              <div key={stat.provider} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 uppercase">{stat.provider}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique temporel */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Activité quotidienne</h3>
        <div className="h-64 flex items-end space-x-1">
          {analytics.dailyStats.map((day, index) => {
            const maxValue = Math.max(...analytics.dailyStats.map(d => d.generations))
            const height = (day.generations / maxValue) * 100
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-brand-500 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${day.generations} générations`}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: string
  color: string
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}