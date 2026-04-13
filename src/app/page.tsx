'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Globe, Cpu, BarChart3, Layers, Mail } from 'lucide-react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export default function LandingPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setParticles(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 6,
        opacity: 0.2 + Math.random() * 0.6,
      }))
    )
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { value: '5,000+', label: 'Marketers' },
    { value: '12M+', label: 'Campaigns' },
    { value: '4.9/5', label: 'Rating' },
    { value: '< 5min', label: 'Launch time' },
  ]

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Copy',
      desc: 'Generate headlines, ad copy, and email sequences in seconds.',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.15)',
    },
    {
      icon: Layers,
      title: 'Multi-Channel',
      desc: 'Facebook, Google, LinkedIn, Email — all from one dashboard.',
      color: '#6366f1',
      glow: 'rgba(99,102,241,0.15)',
    },
    {
      icon: BarChart3,
      title: 'Live Analytics',
      desc: 'Real-time performance tracking across every platform.',
      color: '#10b981',
      glow: 'rgba(16,185,129,0.15)',
    },
    {
      icon: Mail,
      title: 'Smart Emails',
      desc: 'Personalized sequences that convert, built by AI.',
      color: '#ec4899',
      glow: 'rgba(236,72,153,0.15)',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          background: #04050a;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Particles ── */
        .lp-particle {
          position: fixed;
          border-radius: 50%;
          background: #fff;
          pointer-events: none;
          animation: lp-twinkle var(--dur) ease-in-out infinite var(--delay);
          z-index: 0;
        }
        @keyframes lp-twinkle {
          0%,100% { opacity: 0; }
          50%      { opacity: var(--op); }
        }

        /* ── Orbs ── */
        .lp-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: lp-breathe var(--dur,18s) ease-in-out infinite;
        }
        @keyframes lp-breathe {
          0%,100% { transform: scale(1) translate(0,0); opacity: var(--op-lo,.2); }
          33%      { transform: scale(1.15) translate(2%,-2%); opacity: var(--op-hi,.35); }
          66%      { transform: scale(0.9) translate(-1%,1%); opacity: var(--op-lo,.2); }
        }
        .lp-orb-1 {
          width: 900px; height: 900px;
          background: radial-gradient(circle, #4f46e533, transparent 70%);
          top: -30%; left: -20%;
          filter: blur(100px);
          --dur: 20s;
          --op-lo: .15; --op-hi: .3;
        }
        .lp-orb-2 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, #a855f733, transparent 70%);
          bottom: -20%; right: -15%;
          filter: blur(90px);
          --dur: 25s; animation-delay: -8s;
          --op-lo: .12; --op-hi: .25;
        }
        .lp-orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #06b6d422, transparent 70%);
          top: 40%; right: 20%;
          filter: blur(70px);
          --dur: 15s; animation-delay: -4s;
          --op-lo: .1; --op-hi: .2;
        }

        /* ── Grid ── */
        .lp-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* ── Noise ── */
        .lp-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: .035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* ── Navbar ── */
        .lp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 2rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.05);
          background: rgba(4,5,10,.7);
          backdrop-filter: blur(24px);
          transition: background .3s;
        }
        .lp-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .lp-nav-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(99,102,241,.4);
        }
        .lp-nav-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          color: #fff;
          letter-spacing: -.02em;
        }
        .lp-nav-brand span {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,.35);
          letter-spacing: .1em;
        }
        .lp-nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-nav-login {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,.6);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: color .2s, background .2s;
        }
        .lp-nav-login:hover { color: #fff; background: rgba(255,255,255,.06); }
        .lp-nav-signup {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          padding: 9px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          box-shadow: 0 0 20px rgba(99,102,241,.3);
          transition: all .25s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lp-nav-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 30px rgba(99,102,241,.5);
        }

        /* ── Hero ── */
        .lp-hero {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 2rem 80px;
        }

        .lp-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(99,102,241,.12);
          border: 1px solid rgba(99,102,241,.3);
          font-size: 13px;
          font-weight: 500;
          color: #a5b4fc;
          margin-bottom: 2.5rem;
          animation: lp-fadein .8s ease both;
        }
        .lp-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 8px #818cf8;
          animation: lp-blink 2s ease-in-out infinite;
        }
        @keyframes lp-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .lp-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3.2rem, 8vw, 7.5rem);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.04em;
          color: #fff;
          max-width: 900px;
          margin-bottom: 1.5rem;
          animation: lp-fadein .8s .15s ease both;
        }
        .lp-h1-accent {
          display: block;
          background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }
        .lp-h1-accent::after {
          content: '';
          position: absolute;
          left: 50%; bottom: -4px;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c084fc, transparent);
          border-radius: 2px;
        }

        .lp-desc {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(255,255,255,.45);
          max-width: 560px;
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 3rem;
          animation: lp-fadein .8s .3s ease both;
        }

        .lp-cta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          animation: lp-fadein .8s .45s ease both;
        }
        .lp-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 30px;
          border-radius: 12px;
          background: #fff;
          color: #04050a;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all .25s;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #e0e7ff, #f3e8ff);
          opacity: 0;
          transition: opacity .25s;
        }
        .lp-cta-primary:hover::before { opacity: 1; }
        .lp-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(255,255,255,.15); }
        .lp-cta-primary span, .lp-cta-primary svg { position: relative; z-index: 1; }
        .lp-cta-primary svg { transition: transform .25s; }
        .lp-cta-primary:hover svg { transform: translateX(4px); }

        .lp-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 30px;
          border-radius: 12px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.8);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all .25s;
          font-family: 'Syne', sans-serif;
        }
        .lp-cta-secondary:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.22);
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── Stats strip ── */
        .lp-stats {
          display: flex;
          align-items: center;
          gap: 0;
          margin-top: 4rem;
          animation: lp-fadein .8s .6s ease both;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,.02);
          backdrop-filter: blur(10px);
        }
        .lp-stat {
          flex: 1;
          text-align: center;
          padding: 1.2rem 2rem;
          border-right: 1px solid rgba(255,255,255,.07);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -.03em;
        }
        .lp-stat-lbl {
          font-size: 11px;
          color: rgba(255,255,255,.35);
          font-weight: 500;
          letter-spacing: .07em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* ── Mock window ── */
        .lp-mockup-wrap {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 5rem auto 0;
          padding: 0 2rem;
          animation: lp-fadein 1s .7s ease both;
        }
        .lp-mockup-glow {
          position: absolute;
          inset: -40px;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(99,102,241,.25), transparent);
          pointer-events: none;
        }
        .lp-mockup {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(8,9,16,.8);
          backdrop-filter: blur(20px);
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.05),
            0 40px 100px rgba(0,0,0,.8),
            0 0 80px rgba(99,102,241,.15);
        }
        .lp-mockup-top {
          height: 44px;
          background: rgba(255,255,255,.03);
          border-bottom: 1px solid rgba(255,255,255,.06);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
        }
        .lp-dot { width: 11px; height: 11px; border-radius: 50%; }
        .lp-dot-r { background: rgba(255,95,87,.7); }
        .lp-dot-y { background: rgba(255,189,46,.7); }
        .lp-dot-g { background: rgba(39,201,63,.7); }
        .lp-mockup-url {
          flex: 1;
          margin: 0 12px;
          height: 24px;
          background: rgba(255,255,255,.04);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: rgba(255,255,255,.25);
          font-family: monospace;
          letter-spacing: .02em;
        }
        .lp-mockup-body {
          height: 420px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow: hidden;
          position: relative;
        }
        .lp-mockup-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
        }

        /* mock UI elements */
        .lp-mock-row {
          display: flex;
          gap: 12px;
        }
        .lp-mock-card {
          flex: 1;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.03);
          padding: 1rem 1.2rem;
          position: relative;
          overflow: hidden;
          transition: border-color .3s;
        }
        .lp-mock-card-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,.3);
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .lp-mock-card-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -.03em;
        }
        .lp-mock-card-delta {
          font-size: 11px;
          margin-top: 2px;
          font-weight: 600;
        }
        .lp-mock-bar-wrap {
          flex: 2;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.03);
          padding: 1rem 1.2rem;
        }
        .lp-mock-bar-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,.3);
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .lp-mock-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 60px;
        }
        .lp-mock-bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          animation: lp-bar-grow 1.5s ease both;
          animation-delay: var(--d);
        }
        @keyframes lp-bar-grow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
        }

        .lp-mock-progress-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lp-mock-prog-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lp-mock-prog-label {
          font-size: 11px;
          color: rgba(255,255,255,.4);
          font-weight: 500;
          width: 70px;
          flex-shrink: 0;
        }
        .lp-mock-prog-track {
          flex: 1;
          height: 5px;
          border-radius: 3px;
          background: rgba(255,255,255,.06);
          overflow: hidden;
        }
        .lp-mock-prog-fill {
          height: 100%;
          border-radius: 3px;
          animation: lp-fill-grow 1.5s ease both;
          animation-delay: var(--d);
        }
        @keyframes lp-fill-grow {
          from { width: 0 !important; }
        }
        .lp-mock-prog-pct {
          font-size: 11px;
          color: rgba(255,255,255,.4);
          font-weight: 600;
          width: 32px;
          text-align: right;
        }

        .lp-mock-bottom-row {
          display: flex;
          gap: 12px;
        }
        .lp-mock-ai-box {
          flex: 1;
          border-radius: 12px;
          border: 1px solid rgba(99,102,241,.25);
          background: rgba(99,102,241,.06);
          padding: 1rem 1.2rem;
          position: relative;
          overflow: hidden;
        }
        .lp-mock-ai-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,.5), transparent);
        }
        .lp-mock-ai-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .lp-mock-ai-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 8px #818cf8;
          animation: lp-blink 1.5s ease-in-out infinite;
        }
        .lp-mock-ai-title {
          font-size: 10px;
          font-weight: 700;
          color: #a5b4fc;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .lp-mock-ai-lines { display: flex; flex-direction: column; gap: 6px; }
        .lp-mock-ai-line {
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,.08);
          animation: lp-shimmer-line 2s ease-in-out infinite;
          animation-delay: var(--d);
        }
        @keyframes lp-shimmer-line {
          0%,100% { opacity: .4; }
          50%      { opacity: 1; }
        }

        /* ── Features ── */
        .lp-features {
          position: relative;
          z-index: 10;
          max-width: 1100px;
          margin: 8rem auto 0;
          padding: 0 2rem 6rem;
        }
        .lp-section-label {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: rgba(255,255,255,.3);
          margin-bottom: 1rem;
        }
        .lp-section-title {
          text-align: center;
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -.03em;
          margin-bottom: 4rem;
        }
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        .lp-feat-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.025);
          padding: 1.8rem;
          transition: all .3s;
          position: relative;
          overflow: hidden;
        }
        .lp-feat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--glow);
          opacity: 0;
          transition: opacity .3s;
          border-radius: 16px;
        }
        .lp-feat-card:hover::before { opacity: 1; }
        .lp-feat-card:hover {
          border-color: rgba(255,255,255,.13);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,.4);
        }
        .lp-feat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.05);
          margin-bottom: 1.2rem;
          position: relative;
          z-index: 1;
          transition: transform .3s;
        }
        .lp-feat-card:hover .lp-feat-icon { transform: scale(1.1); }
        .lp-feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: .5rem;
          position: relative;
          z-index: 1;
        }
        .lp-feat-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,.45);
          line-height: 1.7;
          font-weight: 300;
          position: relative;
          z-index: 1;
        }

        /* ── Social proof ── */
        .lp-social {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem 8rem;
          text-align: center;
        }
        .lp-avatars {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .lp-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 2px solid #04050a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          margin-left: -10px;
        }
        .lp-avatar:first-child { margin-left: 0; }
        .lp-stars {
          display: flex;
          justify-content: center;
          gap: 3px;
          margin-bottom: .6rem;
        }
        .lp-star { color: #fbbf24; font-size: 16px; }
        .lp-social-text {
          font-size: 14px;
          color: rgba(255,255,255,.4);
          font-weight: 400;
        }
        .lp-social-text strong {
          color: rgba(255,255,255,.8);
          font-weight: 600;
        }

        /* ── Footer ── */
        .lp-footer {
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(255,255,255,.05);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }
        .lp-footer a {
          font-size: 13px;
          color: rgba(255,255,255,.25);
          text-decoration: none;
          transition: color .2s;
        }
        .lp-footer a:hover { color: rgba(255,255,255,.6); }

        /* ── Animations ── */
        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .lp-stats { display: grid; grid-template-columns: 1fr 1fr; }
          .lp-stat { border-right: 1px solid rgba(255,255,255,.07); border-bottom: 1px solid rgba(255,255,255,.07); }
          .lp-stat:nth-child(2) { border-right: none; }
          .lp-stat:nth-child(3) { border-bottom: none; }
          .lp-mock-row { flex-direction: column; }
          .lp-nav-login { display: none; }
        }
      `}</style>

      <div className="lp-root">
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="lp-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              ['--dur' as string]: `${p.duration}s`,
              ['--delay' as string]: `${p.delay}s`,
              ['--op' as string]: p.opacity,
            }}
          />
        ))}

        {/* Background */}
        <div className="lp-noise" />
        <div className="lp-grid" />
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />

        {/* Navbar */}
        <header className="lp-nav">
          <Link href="/" className="lp-nav-logo">
            <div className="lp-nav-icon">
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <span className="lp-nav-brand">
                MCG
                <span>Marketing Platform</span>
              </span>
            </div>
          </Link>
          <div className="lp-nav-links">
            <Link href="/login" className="lp-nav-login">Log in</Link>
            <Link href="/signup" className="lp-nav-signup">
              Get started
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main>
          <section className="lp-hero" ref={heroRef}>
            <div className="lp-pill">
              <span className="lp-pill-dot" />
              AI-driven automation 2.0 is live
            </div>

            <h1 className="lp-h1">
              Launch campaigns
              <span className="lp-h1-accent"> at the speed of AI</span>
            </h1>

            <p className="lp-desc">
              The all-in-one platform that turns your brief into a full
              multi-channel campaign — headlines, ads, emails, analytics —
              in minutes, not weeks.
            </p>

            <div className="lp-cta-row">
              <Link href="/signup" className="lp-cta-primary">
                <span>Get started for free</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="lp-cta-secondary">
                Sign in to workspace
              </Link>
            </div>

            {/* Stats */}
            <div className="lp-stats">
              {stats.map((s) => (
                <div key={s.label} className="lp-stat">
                  <div className="lp-stat-val">{s.value}</div>
                  <div className="lp-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Mockup Window */}
          <div className="lp-mockup-wrap">
            <div className="lp-mockup-glow" />
            <div className="lp-mockup">
              <div className="lp-mockup-top">
                <div className="lp-dot lp-dot-r" />
                <div className="lp-dot lp-dot-y" />
                <div className="lp-dot lp-dot-g" />
                <div className="lp-mockup-url">app.mcg.ai/dashboard</div>
              </div>
              <div className="lp-mockup-body">
                <div className="lp-mockup-shine" />

                {/* Row 1: metric cards + bar chart */}
                <div className="lp-mock-row">
                  <div className="lp-mock-card">
                    <div className="lp-mock-card-label">Impressions</div>
                    <div className="lp-mock-card-val">2.4M</div>
                    <div className="lp-mock-card-delta" style={{ color: '#34d399' }}>↑ 18.3%</div>
                  </div>
                  <div className="lp-mock-card">
                    <div className="lp-mock-card-label">Conversions</div>
                    <div className="lp-mock-card-val">8,291</div>
                    <div className="lp-mock-card-delta" style={{ color: '#34d399' }}>↑ 24.1%</div>
                  </div>
                  <div className="lp-mock-bar-wrap">
                    <div className="lp-mock-bar-label">Weekly Performance</div>
                    <div className="lp-mock-bars">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="lp-mock-bar"
                          style={{
                            height: `${h}%`,
                            background: i === 5
                              ? 'linear-gradient(to top, #6366f1, #a855f7)'
                              : 'rgba(255,255,255,.08)',
                            ['--d' as string]: `${i * 0.1 + 0.5}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 2: channels */}
                <div className="lp-mock-progress-row">
                  {[
                    { label: 'Facebook', pct: 78, color: '#6366f1' },
                    { label: 'Google', pct: 65, color: '#a855f7' },
                    { label: 'LinkedIn', pct: 52, color: '#06b6d4' },
                    { label: 'Email', pct: 89, color: '#10b981' },
                  ].map((ch, i) => (
                    <div key={ch.label} className="lp-mock-prog-item">
                      <div className="lp-mock-prog-label">{ch.label}</div>
                      <div className="lp-mock-prog-track">
                        <div
                          className="lp-mock-prog-fill"
                          style={{
                            width: `${ch.pct}%`,
                            background: ch.color,
                            ['--d' as string]: `${i * 0.15 + 0.8}s`,
                          }}
                        />
                      </div>
                      <div className="lp-mock-prog-pct">{ch.pct}%</div>
                    </div>
                  ))}
                </div>

                {/* Row 3: AI generating */}
                <div className="lp-mock-bottom-row">
                  <div className="lp-mock-ai-box" style={{ flex: 2 }}>
                    <div className="lp-mock-ai-header">
                      <div className="lp-mock-ai-dot" />
                      <div className="lp-mock-ai-title">AI Generating Campaign Copy</div>
                    </div>
                    <div className="lp-mock-ai-lines">
                      {[90, 75, 85, 60].map((w, i) => (
                        <div
                          key={i}
                          className="lp-mock-ai-line"
                          style={{
                            width: `${w}%`,
                            ['--d' as string]: `${i * 0.3}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="lp-mock-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="lp-mock-card-label">ROI</div>
                    <div className="lp-mock-card-val" style={{ color: '#34d399' }}>312%</div>
                    <div className="lp-mock-card-delta" style={{ color: 'rgba(255,255,255,.35)', fontSize: '11px' }}>avg. this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <section className="lp-features">
            <div className="lp-section-label">Everything you need</div>
            <div className="lp-section-title">Built for modern marketers</div>
            <div className="lp-features-grid">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="lp-feat-card"
                  style={{ ['--glow' as string]: f.glow }}
                >
                  <div className="lp-feat-icon">
                    <f.icon size={20} color={f.color} />
                  </div>
                  <div className="lp-feat-title">{f.title}</div>
                  <div className="lp-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Social Proof */}
          <div className="lp-social">
            <div className="lp-avatars">
              {[['A', '#2563EB'], ['S', '#9333EA'], ['M', '#059669'], ['P', '#D97706'], ['K', '#dc2626']].map(([l, bg]) => (
                <div key={l} className="lp-avatar" style={{ background: bg }}>{l}</div>
              ))}
            </div>
            <div className="lp-stars">
              {[1, 2, 3, 4, 5].map(s => <span key={s} className="lp-star">★</span>)}
            </div>
            <p className="lp-social-text">
              Trusted by <strong>5,000+ marketers</strong> worldwide — rated <strong>4.9/5</strong> on average
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="lp-footer">
          <Link href="/">© 2025 MCG</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </>
  )
}
