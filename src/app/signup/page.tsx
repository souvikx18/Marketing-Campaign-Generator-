'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Sparkles, Check } from 'lucide-react'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['bg-danger', 'bg-warning', 'bg-accent']
  const labels = ['Weak', 'Fair', 'Strong']

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(c => (
          <span
            key={c.label}
            className={`flex items-center gap-1 text-xs transition-colors ${
              c.ok ? 'text-accent' : 'text-white/30'
            }`}
          >
            <Check className="w-3 h-3" />
            {c.label}
          </span>
        ))}
      </div>
      {score === 3 && <p className="text-xs text-accent">Strong password ✓</p>}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please accept the Terms of Service to continue.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')

    try {
      // Register user via API route
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.')
        return
      }
      // Sign in immediately after registration
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Account created — please sign in.')
        router.push('/login')
      } else {
        router.push('/onboarding')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/onboarding' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070B14] py-12 px-6">
      {/* Background orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">MCG</span>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-modal">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white mb-1.5">Create your account</h2>
            <p className="text-white/50 text-sm">Start your free trial — no credit card required</p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg px-4 py-3 transition-all duration-150 mb-5 text-sm disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs font-medium">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Chen"
                required
                className="w-full bg-white/[0.07] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-white/[0.07] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-white/[0.07] border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 transition-all ${
                    agreed ? 'bg-primary border-primary' : 'border-white/20 bg-transparent'
                  }`}
                >
                  {agreed && <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />}
                </div>
              </div>
              <span className="text-white/50 text-xs leading-relaxed">
                I agree to{' '}
                <Link href="/terms" className="text-primary-300 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary-300 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg py-3 transition-all duration-150 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-button mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create free account'
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-300 hover:text-primary-200 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Free plan includes 20 AI credits · No credit card required
        </p>
      </div>
    </div>
  )
}
