'use client'

import { useState } from 'react'
import { Plus, X, Globe, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CampaignDraft } from '../CampaignWizard'

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', emoji: '👥', color: '#1877F2', bg: '#EBF5FF', desc: 'Carousel, image & video ads' },
  { id: 'instagram', label: 'Instagram', emoji: '📸', color: '#E1306C', bg: '#FDF2F8', desc: 'Stories, Reels & feed posts' },
  { id: 'google', label: 'Google Ads', emoji: '🔍', color: '#4285F4', bg: '#EBF5FF', desc: 'Search & Display campaigns' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼', color: '#0A66C2', bg: '#EFF6FF', desc: 'Sponsored content & InMail' },
  { id: 'email', label: 'Email', emoji: '✉️', color: '#0E9F6E', bg: '#ECFDF5', desc: 'Newsletter & sequences' },
  { id: 'twitter', label: 'Twitter / X', emoji: '🐦', color: '#1DA1F2', bg: '#EFF6FF', desc: 'Promoted tweets & trends' },
]

const TONES = [
  { id: 'professional', label: 'Professional', emoji: '👔', desc: 'Formal, authoritative, trustworthy' },
  { id: 'friendly', label: 'Friendly', emoji: '😊', desc: 'Warm, conversational, approachable' },
  { id: 'urgent', label: 'Urgent', emoji: '🔥', desc: 'FOMO-driven, time-sensitive' },
  { id: 'humorous', label: 'Humorous', emoji: '😄', desc: 'Witty, light-hearted, fun' },
  { id: 'empathetic', label: 'Empathetic', emoji: '💙', desc: 'Understanding, supportive, caring' },
]

const INTEREST_SUGGESTIONS = [
  'Technology', 'E-commerce', 'Health & Wellness', 'Finance', 'Education',
  'Travel', 'Food & Beverage', 'Fashion', 'Sports', 'Gaming', 'Real Estate', 'Business'
]

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' }, { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' }, { code: 'ja', label: 'Japanese' },
  { code: 'hi', label: 'Hindi' }, { code: 'it', label: 'Italian' },
  { code: 'ko', label: 'Korean' }, { code: 'zh', label: 'Chinese' },
]

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

export default function Step2Platform({ draft, updateDraft }: Props) {
  const [locationInput, setLocationInput] = useState('')
  const [interestInput, setInterestInput] = useState('')

  function togglePlatform(id: string) {
    const has = draft.platforms.includes(id)
    updateDraft({ platforms: has ? draft.platforms.filter(p => p !== id) : [...draft.platforms, id] })
  }

  function addLocation() {
    if (locationInput.trim() && !draft.audience.locations.includes(locationInput.trim())) {
      updateDraft({ audience: { ...draft.audience, locations: [...draft.audience.locations, locationInput.trim()] } })
      setLocationInput('')
    }
  }

  function addInterest(interest: string) {
    if (!draft.audience.interests.includes(interest)) {
      updateDraft({ audience: { ...draft.audience, interests: [...draft.audience.interests, interest] } })
    }
  }

  function removeInterest(interest: string) {
    updateDraft({ audience: { ...draft.audience, interests: draft.audience.interests.filter(i => i !== interest) } })
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="card p-8">
        <div className="mb-5">
          <h2 className="text-h2 text-text-primary">Select Platforms</h2>
          <p className="text-text-muted text-sm mt-1">AI will generate platform-specific content with correct character limits for each.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PLATFORMS.map(p => {
            const isSelected = draft.platforms.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={cn(
                  'flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all relative',
                  isSelected
                    ? 'border-primary shadow-glow'
                    : 'border-border hover:border-primary/30 bg-white'
                )}
                style={isSelected ? { background: p.bg, borderColor: p.color } : {}}
              >
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ background: p.color }}
                  >
                    ✓
                  </div>
                )}
                <div className="text-2xl">{p.emoji}</div>
                <div>
                  <div className="font-semibold text-sm text-text-primary">{p.label}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{p.desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {draft.platforms.length === 0 && (
          <p className="text-xs text-danger mt-3 flex items-center gap-1">
            ⚠ Select at least one platform to continue
          </p>
        )}
      </div>

      {/* Tone Selection */}
      <div className="card p-8">
        <div className="mb-5">
          <h2 className="text-h3 text-text-primary">Brand Tone & Voice</h2>
          <p className="text-text-muted text-sm mt-1">How should the AI write your copy?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateDraft({ tone: t.id })}
              title={t.desc}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                draft.tone === t.id
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border bg-white text-text-muted hover:border-primary/30'
              )}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audience Builder */}
      <div className="card p-8 space-y-6">
        <div>
          <h2 className="text-h3 text-text-primary">Audience Targeting</h2>
          <p className="text-text-muted text-sm mt-1">Define who should see your campaign.</p>
        </div>

        {/* Age Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Min Age</label>
            <input
              type="number"
              className="input"
              value={draft.audience.ageMin}
              onChange={e => updateDraft({ audience: { ...draft.audience, ageMin: Number(e.target.value) } })}
              min={13} max={65}
            />
          </div>
          <div>
            <label className="label">Max Age</label>
            <input
              type="number"
              className="input"
              value={draft.audience.ageMax}
              onChange={e => updateDraft({ audience: { ...draft.audience, ageMax: Number(e.target.value) } })}
              min={draft.audience.ageMin} max={99}
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="label">Gender</label>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Genders' },
              { id: 'male', label: 'Male' },
              { id: 'female', label: 'Female' },
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => updateDraft({ audience: { ...draft.audience, gender: g.id } })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                  draft.audience.gender === g.id
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border bg-white text-text-muted'
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="label">Target Locations</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="e.g. United States, London, California…"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLocation())}
            />
            <button type="button" onClick={addLocation} className="btn-secondary btn-sm">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {draft.audience.locations.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {draft.audience.locations.map(loc => (
                <span key={loc} className="badge badge-draft gap-1.5">
                  <Globe className="w-3 h-3" />
                  {loc}
                  <button onClick={() => updateDraft({ audience: { ...draft.audience, locations: draft.audience.locations.filter(l => l !== loc) } })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="label">Interests & Behaviors</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {INTEREST_SUGGESTIONS.filter(i => !draft.audience.interests.includes(i)).map(i => (
              <button
                key={i}
                type="button"
                onClick={() => addInterest(i)}
                className="text-xs px-2.5 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary-light hover:text-primary transition-colors text-text-muted"
              >
                + {i}
              </button>
            ))}
          </div>
          {draft.audience.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.audience.interests.map(i => (
                <span key={i} className="badge badge-active gap-1.5">
                  {i}
                  <button onClick={() => removeInterest(i)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="label">Campaign Language</label>
          <select
            className="input"
            value={draft.language}
            onChange={e => updateDraft({ language: e.target.value })}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
