'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  PanelLeftClose, PanelLeftOpen, Search, Bell, HelpCircle,
  LogOut, Settings, User as UserIcon, ChevronDown, Menu,
  Plus, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from 'next-auth'

interface TopBarProps {
  user: User & { planTier?: string }
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onMobileMenuOpen: () => void
  onOpenCommandPalette: () => void
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  pro: 'bg-primary-light text-primary',
  agency: 'bg-secondary-light text-secondary',
  enterprise: 'bg-gradient-to-r from-primary to-secondary text-white',
}

export default function TopBar({ user, sidebarOpen, onToggleSidebar, onMobileMenuOpen, onOpenCommandPalette }: TopBarProps) {
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const planTier = (user as Record<string, unknown>)?.planTier as string ?? 'free'

  const notifications = [
    { id: '1', type: 'success', text: 'Campaign "Summer Sale" went live', time: '2m ago' },
    { id: '2', type: 'info', text: 'AI generated 15 ad variants', time: '1h ago' },
    { id: '3', type: 'warning', text: 'Budget 80% utilized for Google Ads', time: '3h ago' },
  ]

  return (
    <header className="sticky top-0 z-30 h-[var(--topbar-height)] glass flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-surface text-text-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar toggle (desktop) */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex p-2 rounded-lg hover:bg-surface text-text-muted transition-colors"
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen
          ? <PanelLeftClose className="w-5 h-5" />
          : <PanelLeftOpen className="w-5 h-5" />
        }
      </button>

      {/* Global search */}
      <div className="flex-1 max-w-lg hidden sm:block">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/50 border border-border/80 hover:bg-white hover:border-primary-300 hover:shadow-subtle-glow cursor-pointer transition-all group"
          onClick={onOpenCommandPalette}
        >
          <Search className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          <span className="text-sm text-text-muted">Search campaigns, templates…</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-border text-[10px] font-mono text-text-muted">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/campaigns/new"
          className="hidden md:flex btn btn-primary h-9 px-4 rounded-lg pointer-events-auto"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-surface text-text-muted transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(n => !n); setUserMenuOpen(false) }}
            className="p-2 rounded-lg hover:bg-surface text-text-muted transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-modal z-50 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm text-text-primary">Notifications</span>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors cursor-pointer border-b border-border/50 last:border-0">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', {
                      'bg-accent': n.type === 'success',
                      'bg-primary': n.type === 'info',
                      'bg-warning': n.type === 'warning',
                    })} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary leading-snug">{n.text}</p>
                      <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button className="text-xs text-primary hover:underline w-full text-center">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(n => !n); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-surface transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-text-primary leading-none">{user.name}</div>
              <div className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize mt-0.5 inline-block', PLAN_COLORS[planTier])}>
                {planTier}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-modal z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
                  <UserIcon className="w-4 h-4 text-text-muted" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
                  <Settings className="w-4 h-4 text-text-muted" /> Settings
                </Link>
                <Link href="/settings/billing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors">
                  <Sparkles className="w-4 h-4 text-text-muted" /> Upgrade Plan
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
