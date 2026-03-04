import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementUsage } from '@/lib/usage';
import { checkRateLimit } from '@/lib/rateLimit';
import type { AIAction, ChatMessage, AIResponse } from '@/types';

const SYSTEM_PROMPTS: Record<AIAction, string> = {
  summarize:
    'You are a concise summarizer. Given note content, produce exactly 2–3 sentences that capture the key ideas. Return plain text only, no markdown.',
  improve:
    "You are an expert editor. Rewrite the following note content with improved grammar, clarity, and flow. Preserve all facts and the author's intent. Return the full rewritten text only, no preamble.",
  'generate-title':
    'You are a titling assistant. Given note content, suggest a single concise title of 3–8 words. Return only the title text, no punctuation at the end, no quotes.',
  'smart-tags':
    'You are a tagging assistant. Given note content, return exactly 3–5 relevant single-word or short-phrase tags. Format your response as a JSON array of strings, e.g. ["tag1","tag2","tag3"]. Nothing else.',
  expand:
    'You are a writing assistant. Continue writing from where the note ends. Add 1–3 coherent paragraphs that logically extend the existing content. Return only the new continuation text, no preamble.',
};

const MAX_TOKENS: Record<AIAction, number> = {
  summarize: 256,
  improve: 1024,
  'generate-title': 64,
  'smart-tags': 128,
  expand: 1024,
};

const VALID_ACTIONS = new Set([...Object.keys(SYSTEM_PROMPTS), 'chat']);

export async function POST(req: NextRequest): Promise<NextResponse<AIResponse>> {
  let action: string;
  let title: string;
  let body: string;
  let messages: ChatMessage[] | undefined;
  let skipUsage: boolean;

  try {
    const json = await req.json();
    action = json.action;
    title = json.title ?? '';
    body = json.body ?? '';
    messages = json.messages;
    skipUsage = json.skipUsage === true;
  } catch {
    return NextResponse.json({ result: '', error: 'Invalid request body' }, { status: 400 });
  }

  // Validate action
  if (!action || !VALID_ACTIONS.has(action)) {
    return NextResponse.json({ result: '', error: `Unknown action: ${action}` }, { status: 400 });
  }

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ result: '', error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit check
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ result: '', error: 'Too many requests' }, { status: 429 });
  }

  // Usage check (skip for auto-title and other silent operations)
  if (!skipUsage) {
    const usage = await checkAndIncrementUsage(user.id);
    if (!usage.allowed) {
      return NextResponse.json({ result: '', error: 'limit_reached' }, { status: 429 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith('sk-...')) {
    return NextResponse.json(
      { result: '', error: 'OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local.' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    if (action === 'chat') {
      const systemPrompt =
        `You are a helpful assistant. The user is asking about their note.\n\n` +
        `Note title: ${title}\n\nNote content:\n${body}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(messages ?? []),
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      const result = response.choices[0]?.message?.content ?? '';
      return NextResponse.json({ result });
    }

    const systemPrompt = SYSTEM_PROMPTS[action as AIAction];

    const userContent = `Title: ${title}\n\nContent:\n${body}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: MAX_TOKENS[action as AIAction] ?? 1024,
      temperature: action === 'generate-title' ? 0.5 : 0.7,
    });

    const raw = response.choices[0]?.message?.content ?? '';

    if (action === 'smart-tags') {
      let tags: string[] = [];
      try {
        tags = JSON.parse(raw);
        if (!Array.isArray(tags)) tags = [];
      } catch {
        tags = raw
          .split(',')
          .map((t) => t.trim().replace(/^["'\s[\]]+|["'\s[\]]+$/g, ''))
          .filter(Boolean);
      }
      return NextResponse.json({ result: raw, tags });
    }

    return NextResponse.json({ result: raw });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    return NextResponse.json({ result: '', error: message }, { status: 500 });
  }
}
