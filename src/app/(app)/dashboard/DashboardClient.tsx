'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Upload, Calendar, TrendingUp, TrendingDown,
  Eye, MousePointerClick, DollarSign, BarChart3,
  Megaphone, ArrowRight, Sparkles, Zap, Target,
  Clock, Activity, Lightbulb, AlertTriangle, CheckCircle
} from 'lucide-react'
import { cn, formatNumber, formatPercent, formatCurrency, formatRelativeTime, getStatusBadgeClass } from '@/lib/utils'
import type { User } from 'next-auth'

interface Props {
  user: User
  workspace: { id: string; name: string; planTier: string } | null
  recentCampaigns: Array<{
    id: string; name: string; status: string; platforms: string;
    goal: string | null; budget: number | null;
    startDate: string | null; createdAt: string
  }>
}

// ── Mock KPI data (will be replaced with real analytics API) ──────────────
const KPI_MOCK = [
  {
    id: 'impressions',
    label: 'Total Impressions',
    value: 284_500,
    delta: 18.4,
    positive: true,
    icon: Eye,
    color: 'text-primary',
    bgColor: 'bg-primary-light',
    format: (v: number) => formatNumber(v),
  },
  {
    id: 'ctr',
    label: 'Avg. Click-Through Rate',
    value: 3.72,
    delta: 0.8,
    positive: true,
    icon: MousePointerClick,
    color: 'text-accent',
    bgColor: 'bg-accent-light',
    format: (v: number) => formatPercent(v),
  },
  {
    id: 'cpa',
    label: 'Cost Per Acquisition',
    value: 14.28,
    delta: -2.1,
    positive: true,
    icon: DollarSign,
    color: 'text-warning',
    bgColor: 'bg-warning-light',
    format: (v: number) => formatCurrency(v),
  },
  {
    id: 'roas',
    label: 'Return on Ad Spend',
    value: 3.84,
    delta: 12.5,
    positive: true,
    icon: BarChart3,
    color: 'text-secondary',
    bgColor: 'bg-secondary-light',
    format: (v: number) => `${v.toFixed(2)}x`,
  },
]

const AI_INSIGHTS = [
  {
    id: '1',
    type: 'tip',
    icon: Lightbulb,
    color: 'text-warning',
    bg: 'bg-warning-light',
    title: 'Post at 2PM for 34% more reach',
    body: 'Your Facebook audience is most active Tuesday–Thursday 2–4PM. Schedule your next campaign in this window.',
  },
  {
    id: '2',
    type: 'alert',
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger-light',
    title: 'Google Ads CTR dropped 12%',
    body: 'Your \"Summer Sale\" campaign CTR fell below baseline. Consider refreshing the ad copy or increasing bids.',
  },
  {
    id: '3',
    type: 'success',
    icon: CheckCircle,
    color: 'text-accent',
    bg: 'bg-accent-light',
    title: 'Email open rate is 38% — top 10%',
    body: 'Your last newsletter outperformed industry average by 2.5x. Use this subject line format for future sends.',
  },
  {
    id: '4',
    type: 'tip',
    icon: Target,
    color: 'text-primary',
    bg: 'bg-primary-light',
    title: 'LinkedIn audience underutilized',
    body: 'B2B campaigns on LinkedIn have high ROI in your industry category. Try expanding reach by 15%.',
  },
]

const PLATFORM_ICONS: Record<string, { emoji: string; color: string }> = {
  facebook: { emoji: 'FB', color: '#1877F2' },
  instagram: { emoji: 'IG', color: '#E1306C' },
  google: { emoji: 'G', color: '#4285F4' },
  linkedin: { emoji: 'Li', color: '#0A66C2' },
  email: { emoji: '✉', color: '#0E9F6E' },
  twitter: { emoji: 'X', color: '#1DA1F2' },
}

// Sparkline SVG mini-chart
function Sparkline({ positive }: { positive: boolean }) {
  const path = positive
    ? 'M0,20 L5,18 L10,15 L15,16 L20,12 L25,10 L30,8 L35,6 L40,4'
    : 'M0,4 L5,6 L10,9 L15,8 L20,12 L25,14 L30,16 L35,18 L40,20'
  return (
    <svg width="40" height="24" className="opacity-60">
      <polyline
        points={path}
        fill="none"
        stroke={positive ? '#0E9F6E' : '#E02424'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DashboardClient({ user, workspace, recentCampaigns }: Props) {
  const router = useRouter()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user.name?.split(' ')[0] ?? 'there'

  const hasNoCampaigns = recentCampaigns.length === 0

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">

      {/* ── Welcome Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text-primary">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-text-muted mt-1 text-body-sm">
            {workspace ? `${workspace.name} · ` : ''}
            Here&apos;s your campaign performance overview
          </p>
        </div>

        {/* Quick Actions (< 3 clicks to new campaign) */}
        <div className="flex flex-wrap gap-2">
          <Link href="/campaigns/new" className="btn-primary btn-sm gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
          <button className="btn-secondary btn-sm gap-2">
            <Upload className="w-4 h-4" />
            Import Brief
          </button>
          <Link href="/calendar" className="btn-ghost btn-sm gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </Link>
        </div>
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_MOCK.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.id} className="kpi-card group cursor-pointer" onClick={() => router.push('/analytics')}>
              <div className="flex items-start justify-between">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', kpi.bgColor)}>
                  <Icon className={cn('w-5 h-5', kpi.color)} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Sparkline positive={kpi.positive} />
                  <div className={cn('flex items-center gap-1 text-xs font-semibold', kpi.positive ? 'text-accent' : 'text-danger')}>
                    {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.positive ? '+' : ''}{kpi.delta}%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{kpi.format(kpi.value)}</div>
                <div className="text-xs text-text-muted mt-0.5">{kpi.label}</div>
              </div>
              <div className="text-[10px] text-text-muted/70 flex items-center gap-1">
                <Activity className="w-3 h-3" /> vs. last 30 days
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Main Grid: Campaigns + Insights ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Campaign List */}
        <div className="card overflow-hidden">
          <div className="section-header px-6 pt-5 pb-0">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              <h2 className="text-h3 text-text-primary">Recent Campaigns</h2>
              <span className="badge-draft text-[10px] ml-1">{recentCampaigns.length}</span>
            </div>
            <Link href="/campaigns" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {hasNoCampaigns ? (
            <EmptyState />
          ) : (
            <div className="table-wrapper border-0 rounded-none mt-4">
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Platforms</th>
                    <th className="hidden lg:table-cell">Goal</th>
                    <th className="hidden lg:table-cell">Budget</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentCampaigns.map(c => {
                    let platforms: string[] = []
                    try { platforms = JSON.parse(c.platforms) } catch { platforms = [] }
                    return (
                      <tr key={c.id} className="cursor-pointer" onClick={() => router.push(`/campaigns/${c.id}`)}>
                        <td>
                          <div className="font-medium text-text-primary">{c.name}</div>
                        </td>
                        <td>
                          <span className={cn('badge text-[11px]', getStatusBadgeClass(c.status))}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="hidden md:table-cell">
                          <div className="flex gap-1">
                            {platforms.slice(0, 3).map(p => {
                              const meta = PLATFORM_ICONS[p.toLowerCase()]
                              return meta ? (
                                <span
                                  key={p}
                                  className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                                  style={{ background: meta.color }}
                                  title={p}
                                >
                                  {meta.emoji}
                                </span>
                              ) : null
                            })}
                            {platforms.length > 3 && (
                              <span className="w-6 h-6 rounded-full bg-border text-text-muted text-[9px] font-bold flex items-center justify-center">
                                +{platforms.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="text-text-muted text-xs capitalize">{c.goal ?? '—'}</span>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="text-text-muted text-xs">
                            {c.budget ? formatCurrency(c.budget) : '—'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 text-text-muted text-xs">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(c.createdAt)}
                          </div>
                        </td>
                        <td>
                          <ArrowRight className="w-4 h-4 text-text-muted" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Insights Feed */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-secondary-light flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <h2 className="text-h3 text-text-primary">AI Insights</h2>
            <span className="badge-ai text-[10px] ml-auto">Live</span>
          </div>

          <div className="space-y-3">
            {AI_INSIGHTS.map(insight => {
              const Icon = insight.icon
              return (
                <div key={insight.id} className="p-3.5 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', insight.bg)}>
                      <Icon className={cn('w-3.5 h-3.5', insight.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary leading-snug mb-1">
                        {insight.title}
                      </p>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        {insight.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Link href="/analytics" className="flex items-center justify-center gap-2 text-xs text-primary hover:underline font-medium pt-1">
            View full analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-h3 text-text-primary mb-2">Launch your first campaign</h3>
      <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        Use AI to generate a complete multi-channel marketing campaign in under 5 minutes.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/campaigns/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Campaign with AI
        </Link>
        <Link href="/templates" className="btn-secondary">
          Browse Templates
        </Link>
      </div>
    </div>
  )
}
