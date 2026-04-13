'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [stars, setStars] = useState<{id: number, top: string, left: string, delay: string, duration: string}[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 3}s`
    })))
  }, [])

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .mcg-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #080c14;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .mcg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .mcg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: mcg-pulse-orb 8s infinite alternate ease-in-out;
          pointer-events: none;
        }
        .mcg-orb-purple {
          background: rgba(147, 51, 234, 0.35);
          width: 500px; height: 500px;
          top: -10%; left: -5%;
          animation-delay: 0s;
        }
        .mcg-orb-blue {
          background: rgba(59, 130, 246, 0.25);
          width: 600px; height: 600px;
          bottom: -20%; right: -10%;
          animation-delay: 2s;
        }
        .mcg-orb-pink {
          background: rgba(236, 72, 153, 0.2);
          width: 400px; height: 400px;
          top: 30%; left: 45%;
          animation-delay: 4s;
        }

        @keyframes mcg-pulse-orb {
          0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          100% { transform: scale(1.1) translate(20px, -20px); opacity: 1; }
        }

        .mcg-star {
          position: absolute;
          width: 2px; height: 2px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          animation: mcg-twinkle ease-in-out infinite;
        }

        @keyframes mcg-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.5); box-shadow: 0 0 8px rgba(255,255,255,0.8); }
        }

        .mcg-card-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          border-radius: 26px;
          padding: 1px;
          box-sizing: border-box;
          margin: 20px;
          overflow: hidden;
        }

        .mcg-card-shimmer {
          position: absolute;
          top: -50%; left: -50%; right: -50%; bottom: -50%;
          background: conic-gradient(from 0deg, transparent 70%, rgba(168, 85, 247, 0.8) 80%, rgba(168, 85, 247, 1) 85%, transparent 100%);
          animation: mcg-spin-shimmer 4s linear infinite;
          z-index: 0;
        }

        @keyframes mcg-spin-shimmer {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .mcg-card {
          position: relative;
          z-index: 1;
          background: rgba(14, 18, 28, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 25px;
          padding: 56px 48px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 32px rgba(255,255,255,0.02), 0 24px 50px rgba(0,0,0,0.6);
        }

        .mcg-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 100px;
          margin-bottom: 36px;
        }
        .mcg-status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c084fc;
          box-shadow: 0 0 12px #c084fc;
          animation: mcg-pulse-dot 2s ease-in-out infinite;
        }
        .mcg-status-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #d8b4fe;
        }
        @keyframes mcg-pulse-dot {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px #c084fc); }
          50% { opacity: 0.4; filter: none; }
        }

        .mcg-heading {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        .mcg-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.5);
          margin: 0 0 36px 0;
        }

        .mcg-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          padding: 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .mcg-btn-google:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.25);
        }

        .mcg-divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
          gap: 16px;
        }
        .mcg-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
        }
        .mcg-divider-text {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1px;
        }

        .mcg-form-group {
          margin-bottom: 24px;
        }
        .mcg-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .mcg-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          display: block;
        }
        .mcg-forgot-link {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .mcg-forgot-link:hover {
          color: #c084fc;
        }

        .mcg-input-wrapper {
          position: relative;
        }
        .mcg-input {
          width: 100%;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-family: inherit;
          font-size: 15px;
          padding: 16px 18px;
          border-radius: 14px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .mcg-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .mcg-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
          background: rgba(0,0,0,0.6);
        }

        .mcg-pass-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }
        .mcg-pass-toggle:hover {
          color: #fff;
        }

        .mcg-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 14px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .mcg-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #7e22ce, #a855f7);
          color: #fff;
          font-family: inherit;
          font-size: 16px;
          font-weight: 600;
          padding: 18px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 32px;
        }
        .mcg-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #9333ea, #d8b4fe);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.4);
        }
        .mcg-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .mcg-arrow {
          transition: transform 0.3s ease;
        }
        .mcg-btn-primary:hover:not(:disabled) .mcg-arrow {
          transform: translateX(4px);
        }

        .mcg-spinner {
          animation: mcg-spin-fast 1s linear infinite;
          opacity: 0.8;
          width: 18px; height: 18px;
        }
        @keyframes mcg-spin-fast {
          to { transform: rotate(360deg); }
        }

        .mcg-footer {
          text-align: center;
          margin-top: 36px;
          font-size: 14px;
          color: rgba(255,255,255,0.4);
        }
        .mcg-footer-link {
          color: #fff;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
          margin-left: 6px;
        }
        .mcg-footer-link:hover {
          color: #d8b4fe;
        }
      ` }} />

      <div className="mcg-container">
        {/* Background Layers */}
        <div className="mcg-grid" />
        <div className="mcg-orb mcg-orb-purple" />
        <div className="mcg-orb mcg-orb-blue" />
        <div className="mcg-orb mcg-orb-pink" />
        
        {stars.map((s) => (
          <div 
            key={s.id} 
            className="mcg-star" 
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration }} 
          />
        ))}

        {/* Login Card */}
        <div className="mcg-card-wrapper">
          <div className="mcg-card-shimmer" />
          <div className="mcg-card">
            
            <div className="mcg-status-badge">
              <div className="mcg-status-dot" />
              <span className="mcg-status-text">MCG WORKSPACE</span>
            </div>

            <h1 className="mcg-heading">Welcome back</h1>
            <p className="mcg-subtitle">Sign in to continue your journey</p>

            <button onClick={handleGoogle} disabled={loading} className="mcg-btn-google">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="mcg-divider">
              <div className="mcg-divider-line" />
              <span className="mcg-divider-text">OR WITH EMAIL</span>
              <div className="mcg-divider-line" />
            </div>

            {error && <div className="mcg-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mcg-form-group">
                <div className="mcg-label-row">
                  <label className="mcg-label">Email address</label>
                </div>
                <div className="mcg-input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="mcg-input"
                  />
                </div>
              </div>

              <div className="mcg-form-group">
                <div className="mcg-label-row">
                  <label className="mcg-label">Password</label>
                  <Link href="/forgot-password" className="mcg-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="mcg-input-wrapper">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mcg-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="mcg-pass-toggle"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="mcg-btn-primary">
                {loading ? (
                  <>
                    <svg className="mcg-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="0"></circle>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} className="mcg-arrow" />
                  </>
                )}
              </button>
            </form>

            <div className="mcg-footer">
              Don't have an account?
              <Link href="/signup" className="mcg-footer-link">
                Create one free
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}
