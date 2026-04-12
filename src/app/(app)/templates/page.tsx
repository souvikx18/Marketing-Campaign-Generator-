import type { Metadata } from 'next'
import { FileText, Star } from 'lucide-react'

export const metadata: Metadata = { title: 'Templates', description: 'Browse and use pre-built campaign templates.' }

const MOCK_TEMPLATES = [
  { id: '1', name: 'Black Friday Sale', category: 'E-commerce', platforms: ['facebook', 'instagram', 'email'], rating: 4.8 },
  { id: '2', name: 'Product Launch', category: 'B2C', platforms: ['google', 'linkedin', 'facebook'], rating: 4.7 },
  { id: '3', name: 'Lead Gen SaaS', category: 'B2B', platforms: ['linkedin', 'google', 'email'], rating: 4.9 },
  { id: '4', name: 'Brand Awareness', category: 'Brand', platforms: ['instagram', 'facebook', 'twitter'], rating: 4.6 },
  { id: '5', name: 'Event Promotion', category: 'Events', platforms: ['facebook', 'instagram', 'email'], rating: 4.7 },
  { id: '6', name: 'Retargeting Campaign', category: 'Retention', platforms: ['facebook', 'google'], rating: 4.8 },
]

const PLATFORM_EMOJIS: Record<string, string> = {
  facebook: '👥', instagram: '📸', google: '🔍', linkedin: '💼', email: '✉️', twitter: '🐦',
}

export default function TemplatesPage() {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-7 h-7 text-primary" />
        <h1 className="text-h1 text-text-primary">Campaign Templates</h1>
      </div>
      <p className="text-text-muted text-sm -mt-4">Start from a proven template and customize with AI.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_TEMPLATES.map(t => (
          <div key={t.id} className="card p-5 cursor-pointer hover:shadow-card-hover group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">{t.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{t.category}</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-warning">
                <Star className="w-3.5 h-3.5 fill-warning" />
                {t.rating}
              </div>
            </div>
            <div className="flex gap-1 mb-4">
              {t.platforms.map(p => (
                <span key={p} className="text-sm" title={p}>{PLATFORM_EMOJIS[p]}</span>
              ))}
            </div>
            <button className="btn-primary btn-sm w-full">Use Template →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
