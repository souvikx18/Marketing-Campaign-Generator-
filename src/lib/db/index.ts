import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import path from 'path'

const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), 'mcg.db')

// Singleton for development hot-reload
const globalForDb = global as unknown as { db: ReturnType<typeof drizzle> | undefined }

function createDb() {
  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  return drizzle(sqlite, { schema })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}

// ── Auto-migrate: create all tables ──────────────────────────────────────
export function initializeDb() {
  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      image TEXT,
      hashed_password TEXT,
      plan_tier TEXT NOT NULL DEFAULT 'free',
      ai_credits_used INTEGER NOT NULL DEFAULT 0,
      brand_voice_id TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      expires_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_tier TEXT NOT NULL DEFAULT 'free',
      client_name TEXT,
      logo_url TEXT,
      brand_voice TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'content_editor',
      invited_by TEXT,
      accepted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS audiences (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      targeting_json TEXT NOT NULL DEFAULT '{}',
      estimated_reach INTEGER,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      brief_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'draft',
      platforms TEXT NOT NULL DEFAULT '[]',
      goal TEXT,
      tone TEXT,
      start_date TEXT,
      end_date TEXT,
      budget REAL,
      audience_id TEXT,
      language TEXT NOT NULL DEFAULT 'en',
      ai_model TEXT NOT NULL DEFAULT 'gpt-4o',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS campaign_contents (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      content_type TEXT NOT NULL,
      body_json TEXT NOT NULL DEFAULT '{}',
      version INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS ab_tests (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      variable TEXT NOT NULL,
      variants_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'running',
      winner_variant_id TEXT,
      confidence REAL,
      success_metric TEXT,
      traffic_split TEXT NOT NULL DEFAULT '50/50',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS analytics_snapshots (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      date TEXT NOT NULL,
      impressions INTEGER NOT NULL DEFAULT 0,
      clicks INTEGER NOT NULL DEFAULT 0,
      conversions INTEGER NOT NULL DEFAULT 0,
      spend REAL NOT NULL DEFAULT 0,
      revenue REAL NOT NULL DEFAULT 0,
      reach INTEGER NOT NULL DEFAULT 0,
      engagement INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS integrations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      expires_at TEXT,
      scopes TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'connected',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `)

  sqlite.close()
}
