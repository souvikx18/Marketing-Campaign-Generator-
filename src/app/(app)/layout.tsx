import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { initializeDb } from '@/lib/db'
import AppShell from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Ensure DB is initialized on server
  try { initializeDb() } catch { /* already initialized */ }

  const session = await auth()
  if (!session?.user) redirect('/login')

  return <AppShell session={session}>{children}</AppShell>
}
