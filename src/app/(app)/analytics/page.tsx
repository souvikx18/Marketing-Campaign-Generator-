import type { Metadata } from 'next'
import { BarChart3, TrendingUp, Eye, MousePointerClick, DollarSign, Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics', description: 'Real-time campaign analytics and performance insights.' }

const METRICS = [
  { label: 'Total Impressions', value: '284.5K', delta: '+18.4%', positive: true, icon: Eye, color: 'text-primary', bg: 'bg-primary-light' },
  { label: 'Click-Through Rate', value: '3.72%', delta: '+0.8%', positive: true, icon: MousePointerClick, color: 'text-accent', bg: 'bg-accent-light' },
  { label: 'Cost Per Acquisition', value: '$14.28', delta: '-$2.10', positive: true, icon: DollarSign, color: 'text-warning', bg: 'bg-warning-light' },
  { label: 'Total Reach', value: '192.1K', delta: '+24.3%', positive: true, icon: Users, color: 'text-secondary', bg: 'bg-secondary-light' },
]

export default function AnalyticsPage() {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-7 h-7 text-primary" />
        <h1 className="text-h1 text-text-primary">Analytics</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className="kpi-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{m.value}</div>
                <div className="text-xs text-text-muted">{m.label}</div>
              </div>
              <div className={`text-xs font-semibold ${m.positive ? 'text-accent' : 'text-danger'}`}>
                {m.delta} vs last 30d
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-8 text-center">
        <TrendingUp className="w-12 h-12 text-primary/30 mx-auto mb-4" />
        <h2 className="text-h3 text-text-primary mb-2">Advanced Analytics — Coming Soon</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          Connect your ad platforms (Meta, Google Ads, LinkedIn) to see real-time unified analytics, time-series charts, and AI insights.
        </p>
      </div>
    </div>
  )
}
