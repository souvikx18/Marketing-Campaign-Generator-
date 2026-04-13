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

      <div className="card text-center relative overflow-hidden min-h-[450px] flex flex-col justify-center items-center bg-white border-border/80">
        {/* Placeholder background representing charts */}
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-primary-200/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />
        
        <div className="relative z-10 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center border-[6px] border-white shadow-glow mb-6 animate-pulse-glow">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-h1 text-text-primary mb-4 relative z-10">Advanced Analytics</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-primary text-white text-[11px] font-bold uppercase tracking-widest shadow-subtle-glow mb-6 relative z-10">
          Coming Soon
        </div>
        <p className="text-text-muted text-base max-w-lg mx-auto relative z-10">
          Connect your ad platforms (Meta, Google Ads, LinkedIn) to unlock real-time unified analytics, advanced time-series charts, and AI-driven insights.
        </p>
      </div>
    </div>
  )
}
