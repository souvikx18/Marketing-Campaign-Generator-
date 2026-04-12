'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sparkles, RefreshCw, AlertCircle, Zap, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CampaignDraft, GeneratedPlatformContent } from '../CampaignWizard'

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

const GENERATION_STAGES = [
  { label: 'Analyzing campaign brief…', duration: 800 },
  { label: 'Building audience personas…', duration: 600 },
  { label: 'Crafting headlines & hooks…', duration: 1000 },
  { label: 'Writing ad copy variants…', duration: 1200 },
  { label: 'Optimizing for each platform…', duration: 800 },
  { label: 'Adding CTAs & hashtags…', duration: 600 },
  { label: 'Finalizing campaign package…', duration: 400 },
]

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2', instagram: '#E1306C', google: '#4285F4',
  linkedin: '#0A66C2', email: '#0E9F6E', twitter: '#1DA1F2',
}

const PLATFORM_EMOJIS: Record<string, string> = {
  facebook: '👥', instagram: '📸', google: '🔍',
  linkedin: '💼', email: '✉️', twitter: '🐦',
}

export default function Step3Generate({ draft, updateDraft, onNext }: Props) {
  const [generating, setGenerating] = useState(false)
  const [stage, setStage] = useState(0)
  const [stageText, setStageText] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const startGeneration = useCallback(async () => {
    setGenerating(true)
    setError('')
    setDone(false)
    setStage(0)

    try {
      // Show generation stages with animation
      for (let i = 0; i < GENERATION_STAGES.length; i++) {
        setStage(i)
        setStageText(GENERATION_STAGES[i].label)
        await new Promise(r => setTimeout(r, GENERATION_STAGES[i].duration))
      }

      // Call AI generation API
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: draft.name,
          description: draft.description,
          goal: draft.goal,
          platforms: draft.platforms,
          tone: draft.tone,
          language: draft.language,
          aiModel: draft.aiModel,
          audience: draft.audience,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error ?? 'Generation failed')
      }

      const data = await res.json()
      updateDraft({ generatedContent: data.content })
      setDone(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed'
      setError(message)
    } finally {
      setGenerating(false)
    }
  }, [draft, updateDraft])

  // Auto-start generation when component mounts
  useEffect(() => {
    if (!draft.generatedContent) {
      startGeneration()
    } else {
      setDone(true)
    }
  }, [])

  const progress = generating ? Math.round((stage / GENERATION_STAGES.length) * 100) : done ? 100 : 0

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-h2 text-text-primary mb-2">
          {done ? 'Content Generated! 🎉' : generating ? 'Generating Your Campaign…' : 'Ready to Generate'}
        </h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          {done
            ? `AI generated content for ${draft.platforms.length} platform${draft.platforms.length > 1 ? 's' : ''}. Review and edit in the next step.`
            : generating
            ? 'Our AI is crafting platform-optimized content based on your brief.'
            : 'Click below to generate AI-powered campaign content across all selected platforms.'}
        </p>
      </div>

      {/* Generation Progress */}
      {(generating || done) && (
        <div className="mb-8 space-y-4">
          {/* Progress bar */}
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-2">
              {generating && (
                <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              )}
              {done ? <CheckCircle className="w-3.5 h-3.5 text-accent" /> : null}
              <span className="typewriter-cursor">{stageText || (done ? 'All done!' : '')}</span>
            </span>
            <span className="font-mono">{progress}%</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-danger-light border border-danger/30 text-danger">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Generation Failed</p>
            <p className="text-sm mt-0.5 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Platform Preview Cards (shown after generation) */}
      {done && draft.generatedContent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(draft.generatedContent).map(([platform, content]) => {
            const color = PLATFORM_COLORS[platform] ?? '#6B7280'
            const emoji = PLATFORM_EMOJIS[platform] ?? '📢'
            return (
              <div
                key={platform}
                className="rounded-xl border-2 p-4 space-y-3"
                style={{ borderColor: `${color}40`, background: `${color}08` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-semibold text-sm capitalize text-text-primary">{platform}</span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-full text-white"
                    style={{ background: color }}
                  >
                    {content.headlines?.length ?? 0} variants
                  </span>
                </div>

                {/* Headline preview */}
                {content.headlines?.[0] && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Top Headline</p>
                    <p className="text-sm font-medium text-text-primary bg-white rounded-lg px-3 py-2 border border-border">
                      &ldquo;{content.headlines[0]}&rdquo;
                    </p>
                  </div>
                )}

                {/* CTA preview */}
                {content.ctas?.[0] && (
                  <div
                    className="text-center text-xs font-semibold text-white rounded-lg py-1.5"
                    style={{ background: color }}
                  >
                    {content.ctas[0]}
                  </div>
                )}

                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Zap className="w-3 h-3" />
                  {(content.bodyTexts?.length ?? 0) + (content.headlines?.length ?? 0)} total pieces generated
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        {!generating && !done && (
          <button onClick={startGeneration} className="btn-primary gap-2">
            <Sparkles className="w-5 h-5" />
            Generate Campaign Content
          </button>
        )}
        {!generating && error && (
          <button onClick={startGeneration} className="btn-secondary gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {done && (
          <div className="flex gap-3">
            <button onClick={startGeneration} className="btn-ghost gap-2 text-sm">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
            <button onClick={onNext} className="btn-primary gap-2">
              Review Content
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
