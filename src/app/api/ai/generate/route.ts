import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '@/lib/env'

const generateSchema = z.object({
  campaignName: z.string().min(1),
  description: z.string().min(5),
  goal: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  tone: z.string().default('professional'),
  language: z.string().default('en'),
  aiModel: z.enum(['gpt-4o', 'gemini']).default('gpt-4o'),
  audience: z.object({
    ageMin: z.number().optional(),
    ageMax: z.number().optional(),
    gender: z.string().optional(),
    locations: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
})

const PLATFORM_CHAR_LIMITS: Record<string, Record<string, number>> = {
  google: { headline: 30, description: 90 },
  facebook: { primary_text: 125, headline: 40 },
  instagram: { caption: 2200 },
  linkedin: { intro: 150, headline: 70 },
  email: { subject: 60 },
  twitter: { tweet: 280 },
}

function buildPrompt(data: z.infer<typeof generateSchema>): string {
  const { campaignName, description, goal, platforms, tone, language, audience } = data

  const platformSpecs = platforms.map(p => {
    const limits = PLATFORM_CHAR_LIMITS[p.toLowerCase()]
    if (!limits) return `- ${p}: captions and ad copy`
    const specs = Object.entries(limits).map(([k, v]) => `${k}: max ${v} chars`).join(', ')
    return `- ${p}: ${specs}`
  }).join('\n')

  const audienceDesc = audience ? [
    audience.ageMin && audience.ageMax ? `Ages ${audience.ageMin}–${audience.ageMax}` : '',
    audience.gender && audience.gender !== 'all' ? audience.gender : '',
    audience.locations?.join(', ') || '',
    audience.interests?.join(', ') || '',
  ].filter(Boolean).join(', ') : 'general audience'

  return `You are an expert marketing copywriter. Generate a complete marketing campaign package.

CAMPAIGN DETAILS:
- Name: ${campaignName}
- Product/Service: ${description}
- Goal: ${goal.replace(/_/g, ' ')}
- Tone: ${tone}
- Language: ${language}
- Target Audience: ${audienceDesc}

PLATFORMS & CHARACTER LIMITS:
${platformSpecs}

Generate content for ALL of these platforms: ${platforms.join(', ')}.

RETURN ONLY VALID JSON in this exact structure (no markdown, no explanation):
{
  ${platforms.map(p => `"${p}": {
    "headlines": [<5 headlines, each within the character limit for ${p}>, ...],
    "bodyTexts": [<3 ad body/primary text variants>, ...],
    "ctas": [<3 call-to-action button texts>, ...]${
      p === 'email' ? `,
    "emailSubjects": [<5 email subject line variants>],
    "emailBody": "<short email body preview>"` : ''
    }${
      ['instagram', 'facebook', 'twitter', 'linkedin'].includes(p) ? `,
    "caption": "<one social media caption>",
    "hashtags": [<8 relevant hashtag strings without the # symbol>]` : ''
    }
  }`).join(',\n  ')}
}`
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a world-class marketing copywriter. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  })
  return response.choices[0]?.message?.content ?? '{}'
}

async function generateWithGemini(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: { responseMimeType: 'application/json' },
  })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Demo content fallback (used when no API key is configured)
function generateDemoContent(platforms: string[], campaignName: string, goal: string) {
  const content: Record<string, unknown> = {}
  const goalLabel = goal.replace(/_/g, ' ')

  for (const platform of platforms) {
    const pContent: Record<string, unknown> = {
      headlines: [
        `${campaignName} — See Why Teams Love It`,
        `Transform Your ${goalLabel} — Start Today`,
        `Trusted by 50,000+ Professionals`,
        `Unlock the Power of Smart Marketing`,
        `Limited Time Offer — Act Now`,
      ],
      bodyTexts: [
        `Discover how ${campaignName} helps you achieve your ${goalLabel} goals faster than ever. Join thousands of satisfied customers.`,
        `Stop wasting time on outdated tools. ${campaignName} gives you everything you need for ${goalLabel} — in one place.`,
        `Ready to level up? ${campaignName} delivers real results for teams of every size. Try it free for 14 days.`,
      ],
      ctas: ['Get Started Free', 'Learn More', 'Try It Now'],
    }

    if (['instagram', 'facebook', 'twitter', 'linkedin'].includes(platform)) {
      pContent.caption = `🚀 Excited to share ${campaignName} with you! We've been working hard to help you achieve ${goalLabel} like never before. Drop a comment below — what's your biggest marketing challenge right now? #${campaignName.replace(/\s/g, '')} #Marketing`
      pContent.hashtags = ['Marketing', 'DigitalMarketing', 'Growth', 'Business', 'AI', 'Campaigns', 'Ads', 'SaaS']
    }

    if (platform === 'email') {
      pContent.emailSubjects = [
        `[New] ${campaignName} changes everything`,
        `Your ${goalLabel} just got a whole lot easier`,
        `We built something special for you`,
        `Less effort, more results — here's how`,
        `🔥 Limited: Try ${campaignName} free this week`,
      ]
      pContent.emailBody = `Hi there,\n\nWe're thrilled to introduce ${campaignName} — the smartest way to drive ${goalLabel} for your business.\n\nHere's what you'll get:\n✅ Instant results\n✅ Easy setup\n✅ 24/7 support\n\nJoin thousands of marketers who are already seeing a difference.\n\nBest,\nThe ${campaignName} Team`
    }

    content[platform] = pContent
  }

  return content
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = generateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check if we have API keys
    const hasOpenAI = env.OPENAI_API_KEY && !env.OPENAI_API_KEY.startsWith('sk-your')
    const hasGemini = env.GEMINI_API_KEY && !env.GEMINI_API_KEY.startsWith('your-')

    let contentJson: Record<string, unknown>

    if (!hasOpenAI && !hasGemini) {
      // Demo mode: return pre-built content
      await new Promise(r => setTimeout(r, 2000)) // simulate API delay
      contentJson = generateDemoContent(data.platforms, data.campaignName, data.goal)
    } else {
      const prompt = buildPrompt(data)

      let rawJson: string
      let usedModel = data.aiModel

      // Primary AI call
      try {
        if (data.aiModel === 'gpt-4o' && hasOpenAI) {
          rawJson = await generateWithOpenAI(prompt)
        } else if (data.aiModel === 'gemini' && hasGemini) {
          rawJson = await generateWithGemini(prompt)
        } else if (hasOpenAI) {
          rawJson = await generateWithOpenAI(prompt)
          usedModel = 'gpt-4o'
        } else {
          rawJson = await generateWithGemini(prompt)
          usedModel = 'gemini'
        }
      } catch (primaryError) {
        console.warn('[ai:generate] Primary model failed, attempting fallback', primaryError)
        // Failover to other provider
        try {
          if (usedModel === 'gpt-4o' && hasGemini) {
            rawJson = await generateWithGemini(prompt)
          } else if (hasOpenAI) {
            rawJson = await generateWithOpenAI(prompt)
          } else {
            throw primaryError
          }
        } catch {
          // Both failed — use demo content
          contentJson = generateDemoContent(data.platforms, data.campaignName, data.goal)
          return NextResponse.json({ content: contentJson, model: 'demo' })
        }
      }

      try {
        contentJson = JSON.parse(rawJson!)
      } catch {
        console.error('[ai:generate] Failed to parse JSON response')
        contentJson = generateDemoContent(data.platforms, data.campaignName, data.goal)
      }
    }

    return NextResponse.json({ content: contentJson, model: data.aiModel })
  } catch (err) {
    console.error('[ai:generate]', err)
    return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
  }
}
