'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Sparkles, Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['bg-rose-500', 'bg-amber-400', 'bg-emerald-500']
  const labels = ['Weak', 'Fair', 'Strong']

  if (!password) return null

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-3 space-y-2.5 overflow-hidden"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`h-1.5 flex-1 rounded-full relative overflow-hidden bg-white/5`}
          >
            <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: i < score ? '0%' : '-100%' }}
               transition={{ duration: 0.4 }}
               className={`absolute inset-0 ${colors[score - 1] || 'bg-white/10'}`} 
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 ${
              c.ok ? 'text-emerald-400' : 'text-white/30'
            }`}
          >
            <motion.div
              animate={{
                scale: c.ok ? [1, 1.5, 1] : 1,
                color: c.ok ? '#34d399' : 'rgba(255,255,255,0.3)'
              }}
              transition={{ duration: 0.3 }}
            >
              <Check className="w-3.5 h-3.5" />
            </motion.div>
            {c.label}
          </span>
        ))}
      </div>
    </motion.div>
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
    <div className="min-h-screen flex items-center justify-center bg-[#03060D] py-12 px-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, 50, 0], 
          y: [0, -30, 0], 
          opacity: [0.15, 0.25, 0.15] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/30 blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1], 
          x: [0, -60, 0], 
          y: [0, 40, 0], 
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.05, 0.15, 0.05] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" 
      />

      <div className="w-full max-w-[460px] relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] relative">
            <div className="absolute inset-0 rounded-2xl border border-white/20"></div>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-2xl tracking-tighter block">MCG</span>
            <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">Marketing Platform</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="w-full relative group"
        >
          {/* Ambient glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-[2rem] blur-xl opacity-60 pointer-events-none"></div>

          <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden">
            {/* Top glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
            
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create your account</h2>
              <p className="text-white/50 text-sm font-medium">Start your free trial — no credit card required</p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl px-4 py-3.5 transition-all duration-300 mb-6 text-sm disabled:opacity-60 border border-white/10 overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-700 ease-in-out transition-transform" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="relative z-10">Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">or with email</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }} 
                  animate={{ opacity: 1, height: 'auto', y: 0 }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="block text-white/70 text-sm font-medium">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="block text-white/70 text-sm font-medium">Work email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="block text-white/70 text-sm font-medium">Password</label>
                <div className="relative group/input">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 pr-11 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Terms */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                        agreed ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ scale: agreed ? 1 : 0, opacity: agreed ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                       <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs leading-relaxed font-medium">
                    I agree to the{' '}
                    <Link href="/terms" className="text-white hover:text-indigo-400 transition-colors underline decoration-white/20 underline-offset-2">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-white hover:text-indigo-400 transition-colors underline decoration-white/20 underline-offset-2">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl py-3.5 transition-all duration-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-4 group/submit"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create free account <ArrowRight className="w-4 h-4 opacity-70 group-hover/submit:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-white/40 text-sm font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-white hover:text-indigo-300 font-semibold transition-colors underline decoration-white/20 underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center text-white/30 text-xs mt-8 font-medium"
        >
          Free plan includes 20 AI credits · No credit card required
        </motion.p>
      </div>
    </div>
  )
}
