import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, workspaces, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils'
import { initializeDb } from '@/lib/db'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    // Ensure DB tables exist
    initializeDb()

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = generateId()

    // Create user
    await db.insert(users).values({
      id: userId,
      email,
      name,
      hashedPassword,
      planTier: 'free',
    })

    // Create default workspace
    const workspaceId = generateId()
    await db.insert(workspaces).values({
      id: workspaceId,
      name: `${name}'s Workspace`,
      ownerId: userId,
      planTier: 'free',
    })

    // Add user as admin of workspace
    await db.insert(teamMembers).values({
      id: generateId(),
      workspaceId,
      userId,
      role: 'admin',
      acceptedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, userId }, { status: 201 })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
