'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Megaphone, Calendar, BarChart3, Users, Settings, FileText, Plug } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const COMMANDS = [
  { id: 'new-campaign', label: 'Create New Campaign', icon: PlusIcon, desc: 'Start the AI campaign wizard', action: '/campaigns/new' },
  { id: 'view-campaigns', label: 'View Campaigns', icon: Megaphone, desc: 'Manage your active campaigns', action: '/campaigns' },
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, desc: 'View performance metrics', action: '/analytics' },
  { id: 'calendar', label: 'Campaign Calendar', icon: Calendar, desc: 'View scheduled content', action: '/calendar' },
  { id: 'audiences', label: 'Audience Library', icon: Users, desc: 'Manage targeting segments', action: '/audiences' },
  { id: 'templates', label: 'Campaign Templates', icon: FileText, desc: 'Browse pre-built templates', action: '/templates' },
  { id: 'integrations', label: 'Integrations', icon: Plug, desc: 'Connect ad accounts', action: '/integrations' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Manage profile and billing', action: '/settings' },
]

function PlusIcon(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setOpen])

  useEffect(() => {
    if (open) setSearch('')
  }, [open])

  if (!open) return null

  const filtered = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) || 
    cmd.desc.toLowerCase().includes(search.toLowerCase())
  )

  function runCommand(action: string) {
    setOpen(false)
    router.push(action)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 cursor-pointer" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

      {/* Modal */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden cursor-default animate-scale-in border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border gap-3 text-text-primary">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-base outline-none placeholder:text-text-muted"
            placeholder="Search commands or jump to..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-surface text-text-muted border border-border/80 tracking-wider">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">
              No results found for "{search}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Suggestions</div>
              {filtered.map(cmd => {
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.id}
                    onClick={() => runCommand(cmd.action)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary-light hover:text-primary transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{cmd.label}</div>
                      <div className="text-xs text-text-muted">{cmd.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-border bg-surface flex justify-between items-center text-[10px] text-text-muted font-medium">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white shadow-sm border border-border">↑↓</kbd> to navigate</span>
            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white shadow-sm border border-border">↵</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1.5">MCG Platform <span className="opacity-50">v1.0</span></span>
        </div>
      </div>
    </div>
  )
}
