import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { Settings, User, Bell, CreditCard, Shield } from 'lucide-react'

export const metadata: Metadata = { title: 'Settings', description: 'Manage your account and workspace settings.' }

const PLAN_FEATURES = {
  free: { name: 'Free', price: '$0', credits: 20, campaigns: 3, platforms: 2 },
  pro: { name: 'Pro', price: '$49/mo', credits: 500, campaigns: 25, platforms: 6 },
  agency: { name: 'Agency', price: '$149/mo', credits: 2000, campaigns: 'Unlimited', platforms: 6 },
  enterprise: { name: 'Enterprise', price: 'Custom', credits: 'Unlimited', campaigns: 'Unlimited', platforms: 6 },
}

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user
  const planTier = (user as Record<string, string>)?.planTier ?? 'free'
  const plan = PLAN_FEATURES[planTier as keyof typeof PLAN_FEATURES] ?? PLAN_FEATURES.free

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-7 h-7 text-primary" />
        <h1 className="text-h1 text-text-primary">Settings</h1>
      </div>

      {/* Profile */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-text-primary">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-2xl font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <div className="font-semibold text-text-primary">{user?.name}</div>
            <div className="text-sm text-text-muted">{user?.email}</div>
          </div>
          <button className="btn-secondary btn-sm ml-auto">Change Avatar</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" defaultValue={user?.name ?? ''} />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" defaultValue={user?.email ?? ''} disabled className="input opacity-60 cursor-not-allowed" />
          </div>
        </div>
        <button className="btn-primary btn-sm">Save Profile</button>
      </div>

      {/* Current Plan */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-text-primary">Plan & Billing</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary-light to-secondary-light border border-primary/20">
          <div>
            <div className="font-bold text-lg text-primary">{plan.name} Plan</div>
            <div className="text-sm text-text-muted">{plan.price} · {plan.credits} AI credits · {plan.campaigns} campaigns</div>
          </div>
          {planTier === 'free' && (
            <button className="btn-primary btn-sm">Upgrade to Pro →</button>
          )}
        </div>
      </div>

      {/* API Keys */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-text-primary">AI API Keys</h2>
        </div>
        <p className="text-text-muted text-sm">
          Configure your own AI provider keys to use your quota. Otherwise, platform credits are used.
        </p>
        <div className="space-y-4">
          <div>
            <label className="label">OpenAI API Key</label>
            <input type="password" className="input font-mono text-sm" placeholder="sk-…" />
          </div>
          <div>
            <label className="label">Google Gemini API Key</label>
            <input type="password" className="input font-mono text-sm" placeholder="AI…" />
          </div>
        </div>
        <button className="btn-primary btn-sm">Save API Keys</button>
      </div>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-h3">Notifications</h2>
        </div>
        {[
          { label: 'Campaign goes live', enabled: true },
          { label: 'AI generation complete', enabled: true },
          { label: 'Budget threshold reached (80%)', enabled: true },
          { label: 'Weekly performance digest', enabled: false },
        ].map(n => (
          <div key={n.label} className="flex items-center justify-between py-2">
            <span className="text-sm text-text-primary">{n.label}</span>
            <div className={`relative w-11 h-6 rounded-full ${n.enabled ? 'bg-primary' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${n.enabled ? 'left-5.5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
