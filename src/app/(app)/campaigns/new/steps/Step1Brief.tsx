'use client'

import { Target, TrendingUp, Users, ShoppingCart, Repeat, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CampaignDraft } from '../CampaignWizard'

const GOALS = [
  { id: 'brand_awareness', label: 'Brand Awareness', icon: Target, color: 'text-primary', bg: 'bg-primary-light', desc: 'Reach new audiences & increase visibility' },
  { id: 'lead_generation', label: 'Lead Generation', icon: Users, color: 'text-secondary', bg: 'bg-secondary-light', desc: 'Capture contacts & grow your pipeline' },
  { id: 'sales_conversion', label: 'Sales Conversion', icon: ShoppingCart, color: 'text-accent', bg: 'bg-accent-light', desc: 'Drive purchases & sign-ups' },
  { id: 'retention', label: 'Retention', icon: Repeat, color: 'text-warning', bg: 'bg-warning-light', desc: 'Re-engage existing customers' },
  { id: 'event_promotion', label: 'Event Promotion', icon: PartyPopper, color: 'text-danger', bg: 'bg-danger-light', desc: 'Drive attendance & registrations' },
]

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

export default function Step1Brief({ draft, updateDraft }: Props) {
  function handleBudgetChange(budget: number) {
    updateDraft({ budget })
    // Auto-split budget equally across platforms
    if (draft.platforms.length > 0) {
      const split = Math.floor(budget / draft.platforms.length)
      const s: Record<string, number> = {}
      draft.platforms.forEach(p => { s[p] = split })
      updateDraft({ budgetSplit: s })
    }
  }

  return (
    <div className="card p-8 space-y-8">
      <div>
        <h2 className="text-h2 text-text-primary mb-1">Tell us about your campaign</h2>
        <p className="text-text-muted text-sm">The AI will use this brief to generate targeted content for all your platforms.</p>
      </div>

      {/* Campaign Name */}
      <div>
        <label className="label">Campaign Name *</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Summer Sale 2025, Product Launch Q3…"
          value={draft.name}
          onChange={e => updateDraft({ name: e.target.value })}
          maxLength={100}
        />
        <p className="text-[11px] text-text-muted mt-1">{draft.name.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label className="label">Product / Service Description *</label>
        <textarea
          className="input resize-none"
          rows={4}
          placeholder="Describe what you're promoting. Include key features, benefits, unique selling points, and any special offers. The more detail, the better the AI output."
          value={draft.description}
          onChange={e => updateDraft({ description: e.target.value })}
          maxLength={2000}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-[11px] text-text-muted">Minimum 10 characters. More detail = better AI output.</p>
          <p className="text-[11px] text-text-muted">{draft.description.length}/2000</p>
        </div>
      </div>

      {/* Goal Selection */}
      <div>
        <label className="label">Campaign Goal *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {GOALS.map(g => {
            const Icon = g.icon
            const isSelected = draft.goal === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => updateDraft({ goal: g.id })}
                className={cn(
                  'flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary-light shadow-glow'
                    : 'border-border bg-white hover:border-primary/40'
                )}
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isSelected ? 'bg-primary' : g.bg)}>
                  <Icon className={cn('w-[18px] h-[18px]', isSelected ? 'text-white' : g.color)} />
                </div>
                <div>
                  <div className={cn('text-sm font-semibold', isSelected ? 'text-primary' : 'text-text-primary')}>
                    {g.label}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{g.desc}</div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Total Campaign Budget (USD)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">$</span>
            <input
              type="number"
              className="input pl-7"
              placeholder="0.00"
              value={draft.budget ?? ''}
              onChange={e => handleBudgetChange(Number(e.target.value))}
              min={0}
              step={100}
            />
          </div>
          <p className="text-[11px] text-text-muted mt-1">AI will suggest an optimal per-platform split</p>
        </div>

        {/* AI Model Selector */}
        <div>
          <label className="label">AI Generation Model</label>
          <div className="flex gap-2">
            {[
              { id: 'gpt-4o', label: 'GPT-4o', sub: 'OpenAI · Recommended' },
              { id: 'gemini', label: 'Gemini', sub: 'Google · Fast' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateDraft({ aiModel: m.id as 'gpt-4o' | 'gemini' })}
                className={cn(
                  'flex-1 flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all',
                  draft.aiModel === m.id
                    ? 'border-primary bg-primary-light'
                    : 'border-border bg-white hover:border-primary/30'
                )}
              >
                <div className={cn('text-sm font-semibold', draft.aiModel === m.id ? 'text-primary' : 'text-text-primary')}>
                  {m.label}
                </div>
                <div className="text-[10px] text-text-muted">{m.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Duration */}
      <div>
        <label className="label">Campaign Duration</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-text-muted mb-1 block">Start Date</label>
            <input
              type="date"
              className="input"
              value={draft.startDate}
              onChange={e => updateDraft({ startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="text-[11px] text-text-muted mb-1 block">End Date</label>
            <input
              type="date"
              className="input"
              value={draft.endDate}
              onChange={e => updateDraft({ endDate: e.target.value })}
              min={draft.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
