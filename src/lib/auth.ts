// ── Auth.js v5 Configuration ──────────────────────────────────────────────
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, accounts, sessions, workspaces, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

async function getOrCreateWorkspace(userId: string, userName: string) {
  const existing = await db.select().from(workspaces).where(eq(workspaces.ownerId, userId)).limit(1)
  if (existing.length > 0) return existing[0]

  const ws = {
    id: generateId(),
    name: `${userName}'s Workspace`,
    ownerId: userId,
    planTier: 'free' as const,
  }
  await db.insert(workspaces).values(ws)

  // Add owner as admin team member
  await db.insert(teamMembers).values({
    id: generateId(),
    workspaceId: ws.id,
    userId,
    role: 'admin',
    acceptedAt: new Date().toISOString(),
  })

  return ws
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

        if (!user || !user.hashedPassword) return null

        const valid = await bcrypt.compare(password, user.hashedPassword)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Upsert user on Google OAuth
        const [existing] = await db.select().from(users).where(eq(users.email, user.email!)).limit(1)

        if (!existing) {
          const newUserId = generateId()
          await db.insert(users).values({
            id: newUserId,
            email: user.email!,
            name: user.name ?? 'User',
            image: user.image,
            planTier: 'free',
          })
          user.id = newUserId
          await getOrCreateWorkspace(newUserId, user.name ?? 'User')
        } else {
          user.id = existing.id
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id!)).limit(1)
        if (dbUser) {
          token.planTier = dbUser.planTier
          token.name = dbUser.name
          token.email = dbUser.email
          token.image = dbUser.image
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.planTier = token.planTier as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET ?? 'mcg-dev-secret-change-in-production',
})
