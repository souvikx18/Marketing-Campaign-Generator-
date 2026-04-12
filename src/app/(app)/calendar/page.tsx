import type { Metadata } from 'next'
import { Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Calendar', description: 'View and manage your campaign schedule.' }

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const month = today.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-7 h-7 text-primary" />
          <h1 className="text-h1 text-text-primary">Campaign Calendar</h1>
        </div>
        <Link href="/campaigns/new" className="btn-primary btn-sm gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 text-text-primary">{month}</h2>
          <div className="flex gap-2">
            <button className="btn-ghost btn-sm">‹ Prev</button>
            <button className="btn-ghost btn-sm">Today</button>
            <button className="btn-ghost btn-sm">Next ›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {days.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="h-24 rounded-lg bg-surface/50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const isToday = i + 1 === today.getDate()
            return (
              <div
                key={i}
                className={`h-24 rounded-lg p-2 border transition-colors hover:border-primary/40 cursor-pointer ${
                  isToday ? 'border-primary bg-primary-light' : 'border-border bg-white hover:bg-surface'
                }`}
              >
                <div className={`text-sm font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                  isToday ? 'bg-primary text-white' : 'text-text-muted'
                }`}>
                  {i + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
