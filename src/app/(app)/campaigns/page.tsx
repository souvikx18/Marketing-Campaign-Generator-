import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import CampaignsClient from './CampaignsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'Manage all your marketing campaigns in one place.',
}

export default async function CampaignsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  let allCampaigns: typeof campaigns.$inferSelect[] = []
  try {
    const ws = await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id!)).limit(1)
    if (ws[0]) {
      allCampaigns = await db.select().from(campaigns).where(eq(campaigns.workspaceId, ws[0].id))
    }
  } catch { /* DB not ready */ }

  return <CampaignsClient campaigns={allCampaigns} />
}
