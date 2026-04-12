import type { Metadata } from 'next'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MCG — Marketing Campaign Generator',
    template: '%s | MCG',
  },
  description:
    'AI-powered marketing campaign generator. Create, schedule, and analyze full multi-channel campaigns in minutes.',
  keywords: ['marketing', 'AI', 'campaign generator', 'advertising', 'SaaS'],
  authors: [{ name: 'MCG Team' }],
  openGraph: {
    title: 'MCG — Marketing Campaign Generator',
    description: 'AI-powered marketing campaign platform for modern teams.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased"><Providers>{children}</Providers></body>
    </html>
  )
}
