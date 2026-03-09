import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementUsage } from '@/lib/usage';
import { checkRateLimit } from '@/lib/rateLimit';
import { processAction } from '@/lib/gamification';

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit check
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Usage check
  const usage = await checkAndIncrementUsage(user.id);
  if (!usage.allowed) {
    return NextResponse.json({ error: 'limit_reached' }, { status: 429 });
  }

  const formData = await req.formData();
  const audioFile = formData.get('audio') as File | null;

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const transcript = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: 'text',
    });

    processAction(user.id, 'transcribe').catch(() => {});
    return NextResponse.json({ transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
