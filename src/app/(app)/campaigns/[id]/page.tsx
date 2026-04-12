import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, workspaces, campaignContents } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import CampaignDetailClient from './CampaignDetailClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Campaign Details`,
  }
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  try {
    const ws = await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id)).limit(1)
    if (!ws[0]) return notFound()

    const campaignItems = await db.select().from(campaigns).where(
      and(eq(campaigns.id, params.id), eq(campaigns.workspaceId, ws[0].id))
    ).limit(1)
    
    const campaign = campaignItems[0]
    if (!campaign) return notFound()

    const contents = await db.select().from(campaignContents).where(
      eq(campaignContents.campaignId, campaign.id)
    )

    return <CampaignDetailClient campaign={campaign} contents={contents} />
  } catch (err) {
    console.error('[campaign:GET]', err)
    return notFound()
  }
}
