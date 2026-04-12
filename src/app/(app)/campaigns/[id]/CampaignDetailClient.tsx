'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, FileText, BarChart3, Users, Play,
  Pause, MoreHorizontal, CheckCircle, Globe, DollarSign,
  Copy, Edit, Plus
} from 'lucide-react'
import { cn, formatCurrency, formatDate, getStatusBadgeClass } from '@/lib/utils'

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2', instagram: '#E1306C', google: '#4285F4',
  linkedin: '#0A66C2', email: '#0E9F6E', twitter: '#1DA1F2',
}
const PLATFORM_EMOJIS: Record<string, string> = {
  facebook: '👥', instagram: '📸', google: '🔍',
  linkedin: '💼', email: '✉️', twitter: '🐦',
}

interface Campaign {
  id: string; name: string; status: string; platforms: string;
  goal: string | null; budget: number | null; language: string;
  startDate: string | null; endDate: string | null; createdAt: string;
  briefJson: string;
}

interface CampaignContent {
  id: string; platform: string; contentType: string; bodyJson: string; status: string;
}

export default function CampaignDetailClient({ campaign, contents }: { campaign: Campaign, contents: CampaignContent[] }) {
  const [activeTab, setActiveTab] = useState<'content' | 'schedule' | 'analytics' | 'team'>('content')
  let parsedPlatforms: string[] = []
  try { parsedPlatforms = JSON.parse(campaign.platforms) } catch { /* ignore */ }

  const tabs = [
    { id: 'content', label: 'Content & Assets', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team & Approvals', icon: Users },
  ] as const

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between mb-2">
        <Link href="/campaigns" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn-ghost btn-sm gap-2"><Edit className="w-4 h-4" /> Edit</button>
          {campaign.status === 'active' ? (
            <button className="btn-secondary btn-sm gap-2"><Pause className="w-4 h-4" /> Pause</button>
          ) : (
            <button className="btn-primary btn-sm gap-2"><Play className="w-4 h-4" /> Go Live</button>
          )}
        </div>
      </div>

      {/* Main Campaign Info Card */}
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none rounded-bl-[100px]" />
        
        <div className="flex items-start justify-between relative z-10 mb-6">
          <div>
            <h1 className="text-h1 text-text-primary mb-2 tracking-tight">{campaign.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className={cn('badge', getStatusBadgeClass(campaign.status))}>
                <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                {campaign.status.replace(/_/g, ' ')}
              </span>
              <span className="text-text-muted flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Language: {campaign.language.toUpperCase()}
              </span>
              <span className="text-text-muted flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Budget: {campaign.budget ? formatCurrency(campaign.budget) : 'Not set'}
              </span>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-light flex items-center justify-center text-primary font-bold text-xs">U</div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-surface flex items-center justify-center text-text-muted text-xs">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-5 border-t border-border">
          {parsedPlatforms.map(p => (
            <span
              key={p}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
              style={{ background: PLATFORM_COLORS[p] ?? '#6B7280' }}
            >
              <span>{PLATFORM_EMOJIS[p]}</span>
              <span className="capitalize">{p}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap',
                isActive ? 'border-primary text-primary bg-primary-light/50' : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content Areas */}
      <div>
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contents.length === 0 ? (
              <div className="col-span-full card p-12 text-center text-text-muted">
                No content generated yet. Go back and complete the wizard.
              </div>
            ) : (
              contents.map(c => {
                let body: any = {}
                try { body = JSON.parse(c.bodyJson) } catch { /* ignore */ }
                const color = PLATFORM_COLORS[c.platform] ?? '#6B7280'
                const emoji = PLATFORM_EMOJIS[c.platform] ?? '📢'

                return (
                  <div key={c.id} className="card overflow-hidden group">
                    <div className="p-4 border-b border-border flex flex-col gap-1 relative overflow-hidden" style={{ background: `${color}0A` }}>
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-white opacity-40 mix-blend-overlay pointer-events-none" style={{ background: color }} />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{emoji}</span>
                          <span className="font-semibold text-text-primary capitalize">{c.platform}</span>
                        </div>
                        <button className="p-1.5 text-text-muted hover:bg-white rounded-md transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {body.headlines?.[0] && (
                        <div>
                          <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Headline</div>
                          <p className="text-sm font-medium leading-relaxed">&ldquo;{body.headlines[0]}&rdquo;</p>
                        </div>
                      )}
                      {body.bodyTexts?.[0] && (
                        <div>
                          <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Primary Text</div>
                          <p className="text-sm text-text-muted leading-relaxed line-clamp-4">{body.bodyTexts[0]}</p>
                        </div>
                      )}
                      {body.ctas?.[0] && (
                        <div>
                          <button className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-2" style={{ background: color }}>
                            {body.ctas[0]}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="px-5 py-3 bg-surface/50 border-t border-border flex items-center justify-between text-xs text-text-muted font-medium">
                      <span>Status: <span className="text-text-primary capitalize">{c.status}</span></span>
                      <button className="hover:text-primary transition-colors flex items-center gap-1">Edit All <ArrowRight className="w-3 h-3" /></button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="card p-8 text-center text-text-muted">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-text-primary font-semibold mb-2">Campaign Schedule</h3>
            <p className="text-sm mb-4">Start: {campaign.startDate ? formatDate(campaign.startDate) : 'Not set'} — End: {campaign.endDate ? formatDate(campaign.endDate) : 'Not set'}</p>
            <button className="btn-secondary btn-sm">Edit Schedule</button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card p-8 text-center text-text-muted">
             <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
             <h3 className="text-text-primary font-semibold mb-2">Campaign Performance</h3>
             <p className="text-sm mb-4">Connect platforms to view live performance data here.</p>
             <Link href="/integrations" className="btn-primary btn-sm">Connect Integrations</Link>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="card p-8 text-center text-text-muted">
             <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
             <h3 className="text-text-primary font-semibold mb-2">Approvals & Feedback</h3>
             <p className="text-sm mb-4">Invite team members to review content before launching.</p>
             <button className="btn-primary btn-sm gap-2"><Plus className="w-4 h-4" /> Invite Member</button>
          </div>
        )}
      </div>
    </div>
  )
}
