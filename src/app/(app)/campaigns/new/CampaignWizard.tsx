'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronLeft, Check, Sparkles, Target, Globe,
  Users, Wand2, FileEdit, Calendar, Rocket, Save,
  AlertCircle, Info, X, Plus
} from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import Step1Brief from './steps/Step1Brief'
import Step2Platform from './steps/Step2Platform'
import Step3Generate from './steps/Step3Generate'
import Step4Review from './steps/Step4Review'
import Step5Schedule from './steps/Step5Schedule'
import Step6Launch from './steps/Step6Launch'

export interface CampaignDraft {
  id: string
  name: string
  description: string
  goal: string
  platforms: string[]
  tone: string
  language: string
  aiModel: 'gpt-4o' | 'gemini'
  budget: number | null
  budgetSplit: Record<string, number>
  startDate: string
  endDate: string
  audience: {
    ageMin: number
    ageMax: number
    gender: string
    locations: string[]
    interests: string[]
    language: string
  }
  generatedContent: Record<string, GeneratedPlatformContent> | null
  scheduledAt: string | null
}

export interface GeneratedPlatformContent {
  headlines: string[]
  bodyTexts: string[]
  ctas: string[]
  caption?: string
  hashtags?: string[]
  emailSubjects?: string[]
  emailBody?: string
}

const STEPS = [
  { id: 1, label: 'Brief', icon: FileEdit, description: 'Campaign details & goals' },
  { id: 2, label: 'Platform & Audience', icon: Target, description: 'Select channels & targeting' },
  { id: 3, label: 'Generate', icon: Sparkles, description: 'AI creates your content' },
  { id: 4, label: 'Review & Edit', icon: Wand2, description: 'Fine-tune generated content' },
  { id: 5, label: 'Schedule', icon: Calendar, description: 'Set publishing timeline' },
  { id: 6, label: 'Launch', icon: Rocket, description: 'Review and go live' },
]

const DEFAULT_DRAFT: CampaignDraft = {
  id: generateId(),
  name: '',
  description: '',
  goal: '',
  platforms: [],
  tone: 'professional',
  language: 'en',
  aiModel: 'gpt-4o',
  budget: null,
  budgetSplit: {},
  startDate: '',
  endDate: '',
  audience: {
    ageMin: 18,
    ageMax: 65,
    gender: 'all',
    locations: [],
    interests: [],
    language: 'en',
  },
  generatedContent: null,
  scheduledAt: null,
}

export default function CampaignWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<CampaignDraft>(DEFAULT_DRAFT)
  const [saving, setSaving] = useState(false)

  function updateDraft(partial: Partial<CampaignDraft>) {
    setDraft(d => ({ ...d, ...partial }))
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return draft.name.trim().length >= 2 && draft.goal !== '' && draft.description.trim().length >= 10
      case 2: return draft.platforms.length >= 1
      case 3: return draft.generatedContent !== null
      case 4: return true
      case 5: return true
      case 6: return true
      default: return true
    }
  }

  async function handleNext() {
    if (step < 6) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleSaveDraft() {
    setSaving(true)
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, status: 'draft' }),
      })
      router.push('/campaigns')
    } finally {
      setSaving(false)
    }
  }

  const StepComponent = [Step1Brief, Step2Platform, Step3Generate, Step4Review, Step5Schedule, Step6Launch][step - 1]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-text-primary flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            New Campaign
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {draft.name || 'Untitled Campaign'} · Step {step} of 6
          </p>
        </div>
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="btn-secondary btn-sm gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
      </div>

      {/* Step Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isDone = step > s.id
            const isActive = step === s.id
            const isPending = step < s.id
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div
                  className={cn(
                    'flex items-center gap-2 cursor-pointer group',
                    isPending && 'opacity-50 cursor-default'
                  )}
                  onClick={() => isDone && setStep(s.id)}
                >
                  {/* Step circle */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0',
                    isDone && 'wizard-step-done',
                    isActive && 'wizard-step-active shadow-glow ring-2 ring-primary/30',
                    isPending && 'wizard-step-pending'
                  )}>
                    {isDone ? <Check className="w-4 h-4" /> : isActive ? <Icon className="w-4 h-4" /> : s.id}
                  </div>
                  {/* Label (hidden on small screens) */}
                  <div className="hidden md:block">
                    <div className={cn('text-xs font-semibold', isActive ? 'text-primary' : isDone ? 'text-accent' : 'text-text-muted')}>
                      {s.label}
                    </div>
                    <div className="text-[10px] text-text-muted hidden lg:block">{s.description}</div>
                  </div>
                </div>
                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-2 min-w-[20px] rounded-full', isDone ? 'bg-accent' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="animate-fade-in">
        <StepComponent draft={draft} updateDraft={updateDraft} onNext={handleNext} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          onClick={() => step > 1 && setStep(s => s - 1)}
          disabled={step === 1}
          className="btn-ghost btn-sm gap-2 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step < 6 ? (
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 2 ? 'Generate Content' : step === 5 ? 'Review & Launch' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
