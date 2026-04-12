// ── Environment Variables ─────────────────────────────────────────────────
export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'mcg-dev-secret-change-in-production',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
  DATABASE_URL: process.env.DATABASE_URL ?? './mcg.db',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}
