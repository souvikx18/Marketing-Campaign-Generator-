import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, workspaces, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import DashboardClient from './DashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your marketing campaign overview and AI insights.',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  // Get user's workspace
  let ws: typeof workspaces.$inferSelect | null = null
  let recentCampaigns: typeof campaigns.$inferSelect[] = []

  try {
    const wsResult = await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id)).limit(1)
    ws = wsResult[0] ?? null

    if (ws) {
      recentCampaigns = await db.select().from(campaigns)
        .where(eq(campaigns.workspaceId, ws.id))
        .limit(10)
    }
  } catch {
    // DB not initialized yet — handled gracefully
  }

  return (
    <DashboardClient
      user={session.user}
      workspace={ws}
      recentCampaigns={recentCampaigns}
    />
  )
}
