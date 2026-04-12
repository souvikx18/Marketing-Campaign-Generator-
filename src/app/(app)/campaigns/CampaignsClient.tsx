'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Search, Filter, MoreHorizontal, Copy, Archive,
  Play, Pause, Trash2, Eye, Megaphone, Calendar,
  ArrowRight, Clock, ChevronDown
} from 'lucide-react'
import { cn, formatCurrency, formatRelativeTime, getStatusBadgeClass } from '@/lib/utils'

const STATUS_OPTIONS = ['All', 'Draft', 'In Review', 'Approved', 'Scheduled', 'Active', 'Paused', 'Completed', 'Archived']
const PLATFORM_ICONS: Record<string, { label: string; color: string }> = {
  facebook: { label: 'FB', color: '#1877F2' },
  instagram: { label: 'IG', color: '#E1306C' },
  google: { label: 'G', color: '#4285F4' },
  linkedin: { label: 'Li', color: '#0A66C2' },
  email: { label: '✉', color: '#0E9F6E' },
  twitter: { label: 'X', color: '#1DA1F2' },
}

interface Campaign {
  id: string; name: string; status: string; platforms: string;
  goal: string | null; budget: number | null;
  startDate: string | null; endDate: string | null; createdAt: string
}

export default function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase().replace(' ', '_')
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text-primary flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-primary" />
            Campaigns
          </h1>
          <p className="text-text-muted text-sm mt-1">{campaigns.length} total campaign{campaigns.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search campaigns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.slice(0, 5).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                statusFilter === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-muted border-border hover:border-primary/40'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Table */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Megaphone className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <h3 className="text-h3 text-text-primary mb-2">{search ? 'No matching campaigns' : 'No campaigns yet'}</h3>
          <p className="text-text-muted text-sm mb-5">
            {search ? 'Try a different search term.' : 'Create your first AI-powered campaign in minutes.'}
          </p>
          {!search && (
            <Link href="/campaigns/new" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Create with AI
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-wrapper border-0 rounded-none">
            <table>
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Platforms</th>
                  <th className="hidden lg:table-cell">Goal</th>
                  <th className="hidden lg:table-cell">Budget</th>
                  <th className="hidden md:table-cell">Schedule</th>
                  <th>Created</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  let platforms: string[] = []
                  try { platforms = JSON.parse(c.platforms) } catch { platforms = [] }
                  return (
                    <tr
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/campaigns/${c.id}`)}
                    >
                      <td>
                        <div className="font-semibold text-text-primary">{c.name}</div>
                      </td>
                      <td>
                        <span className={cn('badge text-[11px]', getStatusBadgeClass(c.status))}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex gap-1">
                          {platforms.slice(0, 4).map(p => {
                            const meta = PLATFORM_ICONS[p.toLowerCase()]
                            return meta ? (
                              <span
                                key={p}
                                title={p}
                                className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                                style={{ background: meta.color }}
                              >
                                {meta.label}
                              </span>
                            ) : null
                          })}
                          {platforms.length > 4 && (
                            <span className="w-6 h-6 rounded-full bg-border text-text-muted text-[9px] font-bold flex items-center justify-center">
                              +{platforms.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className="text-text-muted text-xs capitalize">{c.goal ?? '—'}</span>
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className="text-xs">{c.budget ? formatCurrency(c.budget) : '—'}</span>
                      </td>
                      <td className="hidden md:table-cell">
                        {c.startDate ? (
                          <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Calendar className="w-3 h-3" />
                            {new Date(c.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        ) : <span className="text-text-muted text-xs">—</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(c.createdAt)}
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                            className="p-1.5 rounded-lg hover:bg-surface text-text-muted transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {openMenu === c.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-modal z-20 py-1 animate-slide-up">
                              {[
                                { icon: Eye, label: 'View', action: () => router.push(`/campaigns/${c.id}`) },
                                { icon: Copy, label: 'Duplicate', action: () => {} },
                                { icon: Play, label: 'Activate', action: () => {} },
                                { icon: Pause, label: 'Pause', action: () => {} },
                                { icon: Archive, label: 'Archive', action: () => {} },
                                { icon: Trash2, label: 'Delete', action: () => {}, danger: true },
                              ].map(({ icon: Icon, label, action, danger }) => (
                                <button
                                  key={label}
                                  onClick={() => { action(); setOpenMenu(null) }}
                                  className={cn(
                                    'flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-surface transition-colors text-left',
                                    danger ? 'text-danger hover:bg-danger-light' : 'text-text-primary'
                                  )}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
