'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Rocket, CheckCircle, AlertTriangle, Calendar, DollarSign, Target, Globe, Sparkles, Save, Clock } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { CampaignDraft } from '../CampaignWizard'

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2', instagram: '#E1306C', google: '#4285F4',
  linkedin: '#0A66C2', email: '#0E9F6E', twitter: '#1DA1F2',
}
const PLATFORM_EMOJIS: Record<string, string> = {
  facebook: '👥', instagram: '📸', google: '🔍',
  linkedin: '💼', email: '✉️', twitter: '🐦',
}

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

export default function Step6Launch({ draft, updateDraft, onNext }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'' | 'draft' | 'schedule' | 'publish'>('')
  const [success, setSuccess] = useState(false)

  async function handleLaunch(status: 'draft' | 'scheduled' | 'active') {
    setLoading(true)
    setAction(status === 'draft' ? 'draft' : status === 'scheduled' ? 'schedule' : 'publish')
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, status }),
      })
      setSuccess(true)
      setTimeout(() => router.push('/campaigns'), 2000)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-h2 text-text-primary mb-2">Campaign Saved! 🎉</h2>
        <p className="text-text-muted text-sm mb-6">Redirecting to your campaigns list…</p>
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  const summaryRows = [
    { icon: Sparkles, label: 'AI Model', value: draft.aiModel === 'gpt-4o' ? 'OpenAI GPT-4o' : 'Google Gemini', color: 'text-secondary' },
    { icon: Target, label: 'Goal', value: draft.goal?.replace(/_/g, ' ') ?? '—', color: 'text-primary' },
    { icon: Globe, label: 'Language', value: draft.language.toUpperCase(), color: 'text-primary' },
    { icon: DollarSign, label: 'Budget', value: draft.budget ? formatCurrency(draft.budget) : 'Not set', color: 'text-accent' },
    { icon: Calendar, label: 'Start', value: draft.startDate ? formatDate(draft.startDate) : 'Not set', color: 'text-text-muted' },
    { icon: Clock, label: 'End', value: draft.endDate ? formatDate(draft.endDate) : 'Not set', color: 'text-text-muted' },
  ]

  const contentCount = draft.generatedContent
    ? Object.values(draft.generatedContent).reduce((sum, c) => sum + (c.headlines?.length ?? 0) + (c.bodyTexts?.length ?? 0), 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-h2 text-text-primary">Ready to Launch!</h2>
            <p className="text-text-muted text-sm">Review your campaign summary before going live.</p>
          </div>
        </div>

        {/* Campaign name */}
        <div className="mb-6">
          <div className="text-xs text-text-muted mb-1 font-medium">Campaign Name</div>
          <div className="text-xl font-bold text-text-primary">{draft.name || 'Untitled Campaign'}</div>
        </div>

        {/* Platforms */}
        <div className="mb-6">
          <div className="text-xs text-text-muted mb-2 font-medium">Platforms</div>
          <div className="flex flex-wrap gap-2">
            {draft.platforms.map(p => (
              <span
                key={p}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ background: PLATFORM_COLORS[p] ?? '#6B7280' }}
              >
                <span>{PLATFORM_EMOJIS[p]}</span>
                <span className="capitalize">{p}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {summaryRows.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-surface rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={cn('w-3.5 h-3.5', color)} />
                <span className="text-[11px] text-text-muted font-medium">{label}</span>
              </div>
              <div className="text-sm font-semibold text-text-primary capitalize">{value}</div>
            </div>
          ))}
        </div>

        {/* Content count */}
        <div className="bg-gradient-to-r from-primary-light to-secondary-light rounded-xl p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-text-primary">
              {contentCount} content pieces generated
            </div>
            <div className="text-xs text-text-muted">
              Across {draft.platforms.length} platform{draft.platforms.length !== 1 ? 's' : ''} · Ready to publish
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(!draft.startDate || !draft.endDate) && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-light border border-warning/30">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-warning">No schedule set</p>
            <p className="text-xs text-text-muted mt-0.5">You can still save this as a draft and schedule it later.</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card p-6 space-y-3">
        <h3 className="text-h3 text-text-primary mb-4">Choose an Action</h3>

        <button
          onClick={() => handleLaunch('active')}
          disabled={loading}
          className="w-full btn-primary btn-lg gap-3 justify-center"
        >
          {loading && action === 'publish'
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Rocket className="w-5 h-5" />}
          Publish Now (Go Live)
        </button>

        <button
          onClick={() => handleLaunch('scheduled')}
          disabled={loading || !draft.startDate}
          className="w-full btn-secondary gap-3 justify-center"
        >
          {loading && action === 'schedule'
            ? <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            : <Calendar className="w-5 h-5" />}
          Schedule for {draft.startDate ? formatDate(draft.startDate) : 'selected date'}
        </button>

        <button
          onClick={() => handleLaunch('draft')}
          disabled={loading}
          className="w-full btn-ghost gap-3 justify-center text-text-muted"
        >
          {loading && action === 'draft'
            ? <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
            : <Save className="w-5 h-5" />}
          Save as Draft
        </button>
      </div>
    </div>
  )
}
