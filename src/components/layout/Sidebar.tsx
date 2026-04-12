'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Megaphone, Calendar, BarChart3,
  Users, FileText, Plug, Settings, Sparkles,
  ChevronRight, Zap, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from 'next-auth'

interface SidebarProps {
  open: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  user: User & { planTier?: string }
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/audiences', icon: Users, label: 'Audiences' },
  { href: '/templates', icon: FileText, label: 'Templates' },
  { href: '/integrations', icon: Plug, label: 'Integrations' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, mobileOpen, onMobileClose, user }: SidebarProps) {
  const pathname = usePathname()
  const isCollapsed = !open

  const planTier = (user as Record<string, unknown>)?.planTier as string ?? 'free'
  const isFree = planTier === 'free'

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-border z-20',
          'transition-all duration-300 ease-in-out hidden lg:flex flex-col',
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          pathname={pathname}
          isFree={isFree}
          planTier={planTier}
          user={user}
        />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[260px] bg-white border-r border-border z-40',
          'transition-transform duration-300 flex flex-col lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex justify-end p-4 border-b border-border">
          <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-surface text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          isCollapsed={false}
          pathname={pathname}
          isFree={isFree}
          planTier={planTier}
          user={user}
        />
      </aside>
    </>
  )
}

function SidebarContent({
  isCollapsed, pathname, isFree, planTier, user
}: {
  isCollapsed: boolean
  pathname: string
  isFree: boolean
  planTier: string
  user: User
}) {
  return (
    <>
      {/* Logo */}
      <div className={cn('flex items-center border-b border-border', isCollapsed ? 'px-4 py-5 justify-center' : 'px-5 py-4 gap-3')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <div className="font-bold text-sm text-text-primary tracking-tight leading-none">MCG</div>
            <div className="text-[10px] text-text-muted leading-none mt-0.5">Campaign Generator</div>
          </div>
        )}
      </div>

      {/* Workspace pill */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface cursor-pointer hover:bg-primary-light transition-colors group">
            <div className="w-6 h-6 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-primary">
                {user.name?.charAt(0).toUpperCase() ?? 'W'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">
                {user.name?.split(' ')[0] ?? 'User'}&apos;s Workspace
              </div>
              <div className="text-[10px] text-text-muted capitalize">{planTier} plan</div>
            </div>
            <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0 group-hover:text-primary transition-colors" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn('flex-1 py-3 overflow-y-auto', isCollapsed ? 'px-2' : 'px-3')}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={cn(
                'sidebar-link mb-0.5',
                isActive && 'sidebar-link-active',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-primary' : 'text-text-muted')} />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA (free users only) */}
      {isFree && !isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-4 text-white relative overflow-hidden animate-pulse-glow">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-6 -mt-6" />
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-white/80 mb-3 leading-relaxed">
              Get 500 AI credits, 5 platforms & advanced analytics
            </p>
            <Link
              href="/settings/billing"
              className="block text-center bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg py-2 transition-colors"
            >
              View Plans →
            </Link>
          </div>
        </div>
      )}

      {/* User avatar at bottom when collapsed */}
      {isCollapsed && (
        <div className="p-3 border-t border-border flex justify-center">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-primary">
            {user.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        </div>
      )}
    </>
  )
}
