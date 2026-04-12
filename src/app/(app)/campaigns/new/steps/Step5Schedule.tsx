'use client'

import { useState } from 'react'
import { Calendar, Clock, Zap, Globe, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CampaignDraft } from '../CampaignWizard'

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Los_Angeles',
  'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Dubai', 'Asia/Mumbai', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
]

const AI_SUGGESTED_TIMES = [
  { platform: 'Facebook', time: '2:00 PM – 4:00 PM', days: 'Tue–Thu', reason: 'Peak engagement window for your audience segment' },
  { platform: 'Instagram', time: '11:00 AM – 1:00 PM', days: 'Mon, Wed, Fri', reason: 'Highest reach during lunch browsing hours' },
  { platform: 'LinkedIn', time: '8:00 AM – 9:00 AM', days: 'Tue–Thu', reason: 'Professionals check LinkedIn before workday starts' },
  { platform: 'Email', time: '10:00 AM', days: 'Tuesday', reason: 'Tuesday 10AM is statistically the best email open time' },
  { platform: 'Google', time: 'Always-on', days: 'All days', reason: 'Search campaigns run continuously for maximum capture' },
]

interface Props {
  draft: CampaignDraft
  updateDraft: (partial: Partial<CampaignDraft>) => void
  onNext: () => void
}

// Simple visual calendar month grid
function MiniCalendar({ startDate, endDate }: { startDate: string; endDate: string }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="text-sm font-semibold text-text-primary mb-3 text-center">{monthName}</div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {days.map(d => (
          <div key={d} className="text-[10px] font-medium text-text-muted py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1)
          const isToday = i + 1 === today.getDate()
          const isStart = start && date.toDateString() === start.toDateString()
          const isEnd = end && date.toDateString() === end.toDateString()
          const isRange = start && end && date > start && date < end
          return (
            <div
              key={i}
              className={cn(
                'text-[11px] py-1 rounded-md font-medium',
                isToday && 'ring-1 ring-primary',
                isStart || isEnd ? 'bg-primary text-white' : '',
                isRange ? 'bg-primary-light text-primary' : '',
                !isStart && !isEnd && !isRange ? 'text-text-muted hover:bg-surface' : ''
              )}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Step5Schedule({ draft, updateDraft }: Props) {
  const [timezone, setTimezone] = useState('America/New_York')
  const [recurring, setRecurring] = useState(false)

  return (
    <div className="space-y-6">
      {/* Date Range */}
      <div className="card p-6">
        <h2 className="text-h2 text-text-primary mb-5">Schedule Your Campaign</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
          <div className="space-y-5">
            {/* Start / End */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={draft.startDate ? draft.startDate.replace('Z', '') : ''}
                  onChange={e => updateDraft({ startDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="label">End Date & Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={draft.endDate ? draft.endDate.replace('Z', '') : ''}
                  onChange={e => updateDraft({ endDate: e.target.value })}
                  min={draft.startDate || new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="label flex items-center gap-1">
                <Globe className="w-3 h-3" /> Timezone
              </label>
              <select className="input" value={timezone} onChange={e => setTimezone(e.target.value)}>
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Recurring */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div>
                <div className="text-sm font-semibold text-text-primary">Recurring Campaign</div>
                <div className="text-xs text-text-muted">Automatically repeat this campaign on a schedule</div>
              </div>
              <button
                type="button"
                onClick={() => setRecurring(r => !r)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  recurring ? 'bg-primary' : 'bg-border'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                  recurring ? 'left-5.5' : 'left-0.5'
                )} />
              </button>
            </div>

            {recurring && (
              <div>
                <label className="label">Repeat Frequency</label>
                <select className="input">
                  <option>Weekly – every Monday</option>
                  <option>Bi-weekly</option>
                  <option>Monthly – 1st of month</option>
                  <option>Custom</option>
                </select>
              </div>
            )}
          </div>

          {/* Mini Calendar */}
          <div>
            <MiniCalendar startDate={draft.startDate} endDate={draft.endDate} />
          </div>
        </div>
      </div>

      {/* AI Suggested Posting Times */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-secondary-light flex items-center justify-center">
            <Zap className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-h3 text-text-primary">AI-Suggested Optimal Times</h3>
        </div>
        <div className="space-y-3">
          {AI_SUGGESTED_TIMES.filter(t => draft.platforms.includes(t.platform.toLowerCase())).map(t => (
            <div key={t.platform} className="flex items-start gap-4 p-3.5 rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">{t.platform}</span>
                  <span className="text-xs font-mono text-primary bg-primary-light px-2 py-1 rounded-full">
                    {t.time}
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">{t.days} · {t.reason}</div>
              </div>
            </div>
          ))}
          {draft.platforms.filter(p => AI_SUGGESTED_TIMES.some(t => t.platform.toLowerCase() === p)).length === 0 && (
            <p className="text-text-muted text-sm text-center py-4">Select platforms in Step 2 to see AI time suggestions.</p>
          )}
        </div>
      </div>
    </div>
  )
}
