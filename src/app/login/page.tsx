'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles, Zap, BarChart3, Layers } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const features = [
    { icon: Zap, text: 'Generate campaigns in under 5 minutes' },
    { icon: Layers, text: 'Multi-channel: Facebook, Google, LinkedIn & more' },
    { icon: BarChart3, text: 'Real-time analytics across all platforms' },
  ]

  return (
    <div className="min-h-screen flex bg-[#070B14]">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">MCG</span>
          <span className="text-white/40 text-sm font-medium ml-1">Marketing Campaign Generator</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-4">
              Launch campaigns
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                at the speed of AI
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              The all-in-one platform that turns your brief into a full multi-channel campaign — headlines, ads, emails, analytics — in minutes.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/70 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {['A','S','M','P'].map((l, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#070B14] flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: ['#1A56DB','#7E3AF2','#0E9F6E','#C27803'][i] }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-medium">Trusted by 5,000+ marketers</p>
              <p className="text-white/50 text-xs">Average 4.9 ★ across all reviews</p>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 text-white/20 text-xs">
          © 2025 MCG · Privacy · Terms
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">MCG</span>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-modal">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
              <p className="text-white/50 text-sm">Sign in to your MCG workspace</p>
            </div>

            {/* Google OAuth */}
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

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs font-medium">or with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Email address</label>
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/60 text-xs font-medium">Password</label>
                  <Link href="/forgot-password" className="text-primary-300 text-xs hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg py-3 transition-all duration-150 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-button"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              No account yet?{' '}
              <Link href="/signup" className="text-primary-300 hover:text-primary-200 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
