import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export function formatCurrency(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n)
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 3) + '…'
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    facebook: '#1877F2',
    instagram: '#E1306C',
    google: '#4285F4',
    linkedin: '#0A66C2',
    email: '#0E9F6E',
    twitter: '#1DA1F2',
  }
  return colors[platform.toLowerCase()] ?? '#6B7280'
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    facebook: 'FB',
    instagram: 'IG',
    google: 'G',
    linkedin: 'LI',
    email: '✉',
    twitter: 'X',
  }
  return icons[platform.toLowerCase()] ?? '?'
}

export const PLATFORM_CHAR_LIMITS: Record<string, Record<string, number>> = {
  google: { headline: 30, description: 90 },
  facebook: { primary_text: 125, headline: 40 },
  instagram: { caption: 2200 },
  linkedin: { intro: 150, headline: 70 },
  email: { subject: 60, preheader: 140 },
  twitter: { tweet: 280 },
}

export function getCharLimit(platform: string, type: string): number {
  return PLATFORM_CHAR_LIMITS[platform.toLowerCase()]?.[type] ?? Infinity
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-active',
    paused: 'badge-paused',
    draft: 'badge-draft',
    scheduled: 'badge-scheduled',
    completed: 'badge-completed',
    archived: 'badge-archived',
    in_review: 'badge-review',
    approved: 'badge-approved',
  }
  return map[status] ?? 'badge-draft'
}

export const AI_CREDIT_LIMITS: Record<string, number> = {
  free: 20,
  pro: 500,
  agency: 2000,
  enterprise: Infinity,
}

export const PLAN_CAMPAIGN_LIMITS: Record<string, number> = {
  free: 3,
  pro: 25,
  agency: Infinity,
  enterprise: Infinity,
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
