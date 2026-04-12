import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, workspaces, campaignContents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils'
import { initializeDb } from '@/lib/db'

const campaignSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  goal: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  tone: z.string().optional(),
  language: z.string().default('en'),
  aiModel: z.string().optional(),
  budget: z.number().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().default('draft'),
  generatedContent: z.record(z.unknown()).nullable().optional(),
  audience: z.unknown().optional(),
})

// GET /api/campaigns — list all campaigns for user's workspace
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    initializeDb()
    const ws = await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id)).limit(1)
    if (!ws[0]) return NextResponse.json({ campaigns: [] })

    const result = await db.select().from(campaigns).where(eq(campaigns.workspaceId, ws[0].id))
    return NextResponse.json({ campaigns: result })
  } catch (err) {
    console.error('[campaigns:GET]', err)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

// POST /api/campaigns — create new campaign
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    initializeDb()
    const body = await req.json()
    const parsed = campaignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
    }

    const data = parsed.data

    // Get or create workspace
    let ws = (await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id)).limit(1))[0]
    if (!ws) {
      const wsId = generateId()
      await db.insert(workspaces).values({
        id: wsId,
        name: `${session.user.name}'s Workspace`,
        ownerId: session.user.id,
        planTier: 'free',
      })
      ws = (await db.select().from(workspaces).where(eq(workspaces.ownerId, session.user.id)).limit(1))[0]
    }

    const campaignId = data.id ?? generateId()

    await db.insert(campaigns).values({
      id: campaignId,
      workspaceId: ws.id,
      name: data.name,
      briefJson: JSON.stringify({
        description: data.description ?? '',
        audience: data.audience ?? {},
      }),
      status: data.status as 'draft' | 'scheduled' | 'active',
      platforms: JSON.stringify(data.platforms),
      goal: data.goal ?? null,
      tone: data.tone ?? null,
      language: data.language,
      aiModel: (data.aiModel ?? 'gpt-4o') as 'gpt-4o' | 'gemini',
      budget: data.budget ?? null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    })

    // Store generated content as campaign_contents records
    if (data.generatedContent) {
      for (const [platform, content] of Object.entries(data.generatedContent)) {
        await db.insert(campaignContents).values({
          id: generateId(),
          campaignId,
          platform,
          contentType: 'full_generation',
          bodyJson: JSON.stringify(content),
          version: 1,
          status: 'draft',
        })
      }
    }

    return NextResponse.json({ success: true, campaignId }, { status: 201 })
  } catch (err) {
    console.error('[campaigns:POST]', err)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
