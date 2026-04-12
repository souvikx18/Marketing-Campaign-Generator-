import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PRD §7.2 Color System
        primary: {
          DEFAULT: '#1A56DB',
          light: '#EBF5FF',
          50: '#EBF5FF',
          100: '#C3DAFE',
          200: '#A4CAFE',
          300: '#76A9FA',
          400: '#3F83F8',
          500: '#1C64F2',
          600: '#1A56DB',
          700: '#1E429F',
          800: '#1e3a8a',
          900: '#233876',
        },
        secondary: {
          DEFAULT: '#7E3AF2',
          light: '#F5F3FF',
          100: '#DDD6FE',
          200: '#C4B5FD',
          300: '#A78BFA',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#7E3AF2',
          700: '#6D28D9',
        },
        accent: {
          DEFAULT: '#0E9F6E',
          light: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#0E9F6E',
        },
        warning: {
          DEFAULT: '#C27803',
          light: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#C27803',
        },
        danger: {
          DEFAULT: '#E02424',
          light: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#E02424',
        },
        surface: {
          DEFAULT: '#F9FAFB',
          dark: '#111827',
          card: '#FFFFFF',
          'card-dark': '#1F2937',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        },
        text: {
          primary: '#1F2937',
          muted: '#6B7280',
          'primary-dark': '#F9FAFB',
          'muted-dark': '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['3rem', { lineHeight: '1.15', fontWeight: '800' }],
        h1: ['2rem', { lineHeight: '1.25', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        h3: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)',
        button: '0 1px 2px rgba(26,86,219,0.3)',
        glow: '0 0 20px rgba(26,86,219,0.25)',
        'glow-purple': '0 0 20px rgba(126,58,242,0.25)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'counter-up': 'counterUp 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(26,86,219,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(26,86,219,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1A56DB 0%, #7E3AF2 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        'shimmer-gradient':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}

export default config
