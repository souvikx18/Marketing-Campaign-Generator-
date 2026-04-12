'use client'

import { useState } from 'react'
import { RefreshCw, Copy, Check, ChevronDown, ChevronUp, BarChart3, Smile, Meh, Frown } from 'lucide-react'
import { cn, PLATFORM_CHAR_LIMITS } from '@/lib/utils'
import type { CampaignDraft } from '../CampaignWizard'

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2', instagram: '#E1306C', google: '#4285F4',
  linkedin: '#0A66C2', email: '#0E9F6E', twitter: '#1DA1F2',
}
const PLATFORM_EMOJIS: Record<string, string> = {
  facebook: '👥', instagram: '📸', google: '🔍',
  linkedin: '💼', email: '✉️', twitter: '🐦',
}

function CharCountBar({ value, max }: { value: number; max: number }) {
  if (!max || max === Infinity) return null
  const pct = Math.min((value / max) * 100, 100)
  const status = pct > 100 ? 'over' : pct > 85 ? 'warn' : 'ok'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', `char-count-${status}`)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={cn('text-[10px] font-mono', status === 'over' ? 'text-danger' : status === 'warn' ? 'text-warning' : 'text-text-muted')}>
        {value}/{max}
      </span>
    </div>
  )
}

function getSentiment(text: string): { label: string; icon: typeof Smile; color: string } {
  const positiveWords = ['amazing', 'great', 'best', 'love', 'excellent', 'outstanding', 'save', 'free', 'new', 'exclusive']
  const negativeWords = ['problem', 'fail', 'bad', 'worst', 'never', 'hate', 'stop', 'avoid']
  const lower = text.toLowerCase()
  const pos = positiveWords.filter(w => lower.includes(w)).length
  const neg = negativeWords.filter(w => lower.includes(w)).length
  if (neg > pos) return { label: 'Negative', icon: Frown, color: 'text-danger' }
  if (pos > 0) return { label: 'Positive', icon: Smile, color: 'text-accent' }
  return { label: 'Neutral', icon: Meh, color: 'text-text-muted' }
}

function getReadabilityGrade(text: string): string {
  if (!text.trim()) return '—'
  const words = text.split(/\s+/).filter(Boolean).length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1
  const syllables = text.split(/[aeiouAEIOU]/).length - 1
  const grade = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  if (grade > 80) return 'Grade 6 (Easy)'
  if (grade > 60) return 'Grade 9 (Standard)'
  if (grade > 40) return 'Grade 12 (Difficult)'
  return 'College+ (Very Hard)'
}

interface EditableTextProps {
  value: string
  onChange: (val: string) => void
  platform: string
  type: string
  multiline?: boolean
  rows?: number
}

function EditableText({ value, onChange, platform, type, multiline, rows = 3 }: EditableTextProps) {
  const [copied, setCopied] = useState(false)
  const max = PLATFORM_CHAR_LIMITS[platform]?.[type] ?? Infinity
  const sentiment = getSentiment(value)
  const SentimentIcon = sentiment.icon

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      {multiline ? (
        <textarea
          className="input resize-none text-sm"
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className="input text-sm pr-10"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-surface hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
        title="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
      </button>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-3">
          {/* Sentiment */}
          <div className={cn('flex items-center gap-1 text-[10px] font-medium', sentiment.color)}>
            <SentimentIcon className="w-3 h-3" />
            {sentiment.label}
          </div>
          {/* Readability */}
          <div className="flex items-center gap-1 text-[10px] text-text-muted">
            <BarChart3 className="w-3 h-3" />
            {getReadabilityGrade(value)}
          </div>
        </div>
        <CharCountBar value={value.length} max={max} />
      </div>
    </div>
  )
}

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

export default function Step4Review({ draft, updateDraft }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    draft.platforms[0] ?? null
  )

  if (!draft.generatedContent) {
    return (
      <div className="card p-8 text-center">
        <p className="text-text-muted">No content generated yet. Go back to Step 3.</p>
      </div>
    )
  }

  function updateContent(platform: string, field: string, value: string | string[]) {
    updateDraft({
      generatedContent: {
        ...draft.generatedContent!,
        [platform]: {
          ...draft.generatedContent![platform],
          [field]: value,
        },
      },
    })
  }

  function updateHeadline(platform: string, idx: number, value: string) {
    const headlines = [...(draft.generatedContent![platform]?.headlines ?? [])]
    headlines[idx] = value
    updateContent(platform, 'headlines', headlines)
  }

  function updateBodyText(platform: string, idx: number, value: string) {
    const texts = [...(draft.generatedContent![platform]?.bodyTexts ?? [])]
    texts[idx] = value
    updateContent(platform, 'bodyTexts', texts)
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-h2 text-text-primary mb-1">Review & Edit Content</h2>
        <p className="text-text-muted text-sm">
          Fine-tune the AI-generated content. Character limits are enforced per platform.
        </p>
      </div>

      {draft.platforms.map(platform => {
        const content = draft.generatedContent![platform]
        const isOpen = expanded === platform
        const color = PLATFORM_COLORS[platform] ?? '#6B7280'
        const emoji = PLATFORM_EMOJIS[platform] ?? '📢'
        if (!content) return null

        return (
          <div key={platform} className="card overflow-hidden">
            {/* Platform Header (accordion trigger) */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : platform)}
              className="w-full flex items-center justify-between p-5 hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: color }}
                >
                  {emoji}
                </div>
                <div className="text-left">
                  <div className="font-semibold capitalize">{platform}</div>
                  <div className="text-[11px] text-text-muted">
                    {content.headlines?.length ?? 0} headlines · {content.bodyTexts?.length ?? 0} body texts
                    {content.emailSubjects ? ` · ${content.emailSubjects.length} email subjects` : ''}
                  </div>
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-6 border-t border-border pt-5">
                {/* Headlines */}
                {content.headlines && content.headlines.length > 0 && (
                  <div>
                    <label className="label mb-3">Headlines ({content.headlines.length} variants)</label>
                    <div className="space-y-3">
                      {content.headlines.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[10px] font-mono text-text-muted mt-3.5 w-5 flex-shrink-0">{i + 1}</span>
                          <div className="flex-1">
                            <EditableText
                              value={h}
                              onChange={val => updateHeadline(platform, i, val)}
                              platform={platform}
                              type="headline"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Texts */}
                {content.bodyTexts && content.bodyTexts.length > 0 && (
                  <div>
                    <label className="label mb-3">Ad Copy / Body Text ({content.bodyTexts.length} variants)</label>
                    <div className="space-y-3">
                      {content.bodyTexts.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[10px] font-mono text-text-muted mt-3.5 w-5 flex-shrink-0">{i + 1}</span>
                          <div className="flex-1">
                            <EditableText
                              value={b}
                              onChange={val => updateBodyText(platform, i, val)}
                              platform={platform}
                              type={platform === 'facebook' ? 'primary_text' : platform === 'instagram' ? 'caption' : 'description'}
                              multiline
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email-specific */}
                {content.emailSubjects && (
                  <div>
                    <label className="label mb-3">Email Subject Lines ({content.emailSubjects.length} variants)</label>
                    <div className="space-y-3">
                      {content.emailSubjects.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[10px] font-mono text-text-muted mt-3.5 w-5 flex-shrink-0">{i + 1}</span>
                          <div className="flex-1">
                            <EditableText
                              value={s}
                              onChange={val => {
                                const subs = [...content.emailSubjects!]
                                subs[i] = val
                                updateContent(platform, 'emailSubjects', subs)
                              }}
                              platform={platform}
                              type="subject"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                {content.ctas && content.ctas.length > 0 && (
                  <div>
                    <label className="label mb-3">Call-to-Action Buttons</label>
                    <div className="flex flex-wrap gap-2">
                      {content.ctas.map((cta, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                          style={{ background: color }}
                        >
                          {cta}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {content.hashtags && content.hashtags.length > 0 && (
                  <div>
                    <label className="label mb-2">Hashtags</label>
                    <div className="flex flex-wrap gap-1.5">
                      {content.hashtags.map((tag, i) => (
                        <span key={i} className="badge badge-active text-[11px]">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
