import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ── Users ─────────────────────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  image: text('image'),
  hashedPassword: text('hashed_password'),
  planTier: text('plan_tier', { enum: ['free', 'pro', 'agency', 'enterprise'] }).notNull().default('free'),
  aiCreditsUsed: integer('ai_credits_used').notNull().default(0),
  brandVoiceId: text('brand_voice_id'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── OAuth Accounts ────────────────────────────────────────────────────────
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at'),
})

// ── Sessions ──────────────────────────────────────────────────────────────
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
})

// ── Workspaces ────────────────────────────────────────────────────────────
export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planTier: text('plan_tier', { enum: ['free', 'pro', 'agency', 'enterprise'] }).notNull().default('free'),
  clientName: text('client_name'),
  logoUrl: text('logo_url'),
  brandVoice: text('brand_voice'), // JSON string
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Team Members ──────────────────────────────────────────────────────────
export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'campaign_manager', 'content_editor', 'analyst', 'client_viewer'] }).notNull().default('content_editor'),
  invitedBy: text('invited_by'),
  acceptedAt: text('accepted_at'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Audiences ─────────────────────────────────────────────────────────────
export const audiences = sqliteTable('audiences', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  targetingJson: text('targeting_json').notNull().default('{}'),
  estimatedReach: integer('estimated_reach'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Campaigns ─────────────────────────────────────────────────────────────
export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  briefJson: text('brief_json').notNull().default('{}'),
  status: text('status', {
    enum: ['draft', 'in_review', 'approved', 'scheduled', 'active', 'paused', 'completed', 'archived']
  }).notNull().default('draft'),
  platforms: text('platforms').notNull().default('[]'), // JSON array
  goal: text('goal'),
  tone: text('tone'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: real('budget'),
  audienceId: text('audience_id'),
  language: text('language').notNull().default('en'),
  aiModel: text('ai_model', { enum: ['gpt-4o', 'gemini'] }).notNull().default('gpt-4o'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Campaign Contents ─────────────────────────────────────────────────────
export const campaignContents = sqliteTable('campaign_contents', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  contentType: text('content_type').notNull(), // 'headlines' | 'body' | 'email_subject' | 'email_body' | 'social_caption' | 'hashtags' | 'cta' | 'meta_description'
  bodyJson: text('body_json').notNull().default('{}'),
  version: integer('version').notNull().default(1),
  status: text('status', { enum: ['draft', 'approved', 'published'] }).notNull().default('draft'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── A/B Tests ─────────────────────────────────────────────────────────────
export const abTests = sqliteTable('ab_tests', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  variable: text('variable').notNull(),
  variantsJson: text('variants_json').notNull().default('[]'),
  status: text('status', { enum: ['running', 'completed', 'paused'] }).notNull().default('running'),
  winnerVariantId: text('winner_variant_id'),
  confidence: real('confidence'),
  successMetric: text('success_metric'),
  trafficSplit: text('traffic_split').notNull().default('50/50'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Analytics Snapshots ───────────────────────────────────────────────────
export const analyticsSnapshots = sqliteTable('analytics_snapshots', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  date: text('date').notNull(),
  impressions: integer('impressions').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  conversions: integer('conversions').notNull().default(0),
  spend: real('spend').notNull().default(0),
  revenue: real('revenue').notNull().default(0),
  reach: integer('reach').notNull().default(0),
  engagement: integer('engagement').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

// ── Integrations ──────────────────────────────────────────────────────────
export const integrations = sqliteTable('integrations', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'meta' | 'google_ads' | 'linkedin' | 'mailchimp' etc.
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: text('expires_at'),
  scopes: text('scopes').notNull().default('[]'),
  status: text('status', { enum: ['connected', 'error', 'expired'] }).notNull().default('connected'),
  createdAt: text('created_at').notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
})

export type User = typeof users.$inferSelect
export type Workspace = typeof workspaces.$inferSelect
export type Campaign = typeof campaigns.$inferSelect
export type CampaignContent = typeof campaignContents.$inferSelect
export type Analytics = typeof analyticsSnapshots.$inferSelect
