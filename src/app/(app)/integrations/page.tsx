import type { Metadata } from 'next'
import { Plug, CheckCircle, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Integrations', description: 'Connect your ad platforms and marketing tools.' }

const INTEGRATIONS = [
  { id: 'meta', name: 'Meta Ads', emoji: '👥', desc: 'Facebook & Instagram advertising', status: 'available' },
  { id: 'google', name: 'Google Ads', emoji: '🔍', desc: 'Search, Display & YouTube', status: 'available' },
  { id: 'linkedin', name: 'LinkedIn Ads', emoji: '💼', desc: 'B2B advertising & sponsored content', status: 'available' },
  { id: 'mailchimp', name: 'Mailchimp', emoji: '✉️', desc: 'Email marketing & automation', status: 'available' },
  { id: 'hubspot', name: 'HubSpot', emoji: '🧲', desc: 'CRM & marketing hub', status: 'coming_soon' },
  { id: 'klaviyo', name: 'Klaviyo', emoji: '📧', desc: 'E-commerce email & SMS', status: 'coming_soon' },
  { id: 'ga4', name: 'Google Analytics 4', emoji: '📊', desc: 'Web analytics & conversion tracking', status: 'available' },
  { id: 'salesforce', name: 'Salesforce', emoji: '☁️', desc: 'Enterprise CRM integration', status: 'coming_soon' },
]

export default function IntegrationsPage() {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Plug className="w-7 h-7 text-primary" />
        <h1 className="text-h1 text-text-primary">Integrations</h1>
      </div>
      <p className="text-text-muted text-sm -mt-4">Connect your marketing platforms to sync campaigns and pull analytics automatically.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(i => (
          <div key={i.id} className="card p-5 flex items-center gap-4">
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-surface rounded-xl flex-shrink-0">{i.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-text-primary">{i.name}</div>
              <div className="text-xs text-text-muted mt-0.5">{i.desc}</div>
            </div>
            {i.status === 'coming_soon' ? (
              <span className="flex items-center gap-1.5 text-xs text-text-muted bg-surface px-3 py-2 rounded-full border border-border whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" /> Soon
              </span>
            ) : (
              <button className="btn-secondary btn-sm whitespace-nowrap">Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
