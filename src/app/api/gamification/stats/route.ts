import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ACHIEVEMENTS, getLevelTitle, getXPForLevel, LEVEL_THRESHOLDS } from '@/lib/gamification-config';
import { checkWordAchievements } from '@/lib/gamification';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [xpRes, streakRes, statsRes, achievementsRes, notesRes] = await Promise.all([
    supabaseAdmin.from('user_xp').select('*').eq('user_id', user.id).single(),
    supabaseAdmin.from('user_streaks').select('*').eq('user_id', user.id).single(),
    supabaseAdmin.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabaseAdmin.from('user_achievements').select('*').eq('user_id', user.id),
    supabaseAdmin.from('notes').select('body, updated_at').eq('user_id', user.id),
  ]);

  const xp = xpRes.data?.xp ?? 0;
  const level = xpRes.data?.level ?? 1;
  const xpForCurrent = LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)] ?? 0;
  const xpForNext = getXPForLevel(level);
  const xpProgress = xpForNext > xpForCurrent ? (xp - xpForCurrent) / (xpForNext - xpForCurrent) : 1;

  const notes = notesRes.data ?? [];
  const totalWords = notes.reduce((sum, n) => {
    const count = n.body?.trim() ? n.body.trim().split(/\s+/).length : 0;
    return sum + count;
  }, 0);

  // Daily activity last 30 days (count of notes edited per day)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dailyActivity: Record<string, number> = {};
  for (const n of notes) {
    const date = n.updated_at.split('T')[0];
    if (new Date(date) >= thirtyDaysAgo) {
      dailyActivity[date] = (dailyActivity[date] ?? 0) + 1;
    }
  }

  // Check word achievements (idempotent)
  await checkWordAchievements(user.id, totalWords);

  // Re-fetch achievements after potential new unlocks
  const { data: finalAchievements } = await supabaseAdmin
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id);

  const achievements = (finalAchievements ?? [])
    .map((a) => {
      const def = ACHIEVEMENTS[a.achievement_id];
      if (!def) return null;
      return { id: a.achievement_id, unlockedAt: a.unlocked_at, ...def };
    })
    .filter(Boolean);

  return NextResponse.json({
    xp,
    level,
    levelTitle: getLevelTitle(level),
    xpProgress: Math.min(xpProgress, 1),
    xpForNext,
    xpForCurrent,
    streak: {
      current: streakRes.data?.current_streak ?? 0,
      longest: streakRes.data?.longest_streak ?? 0,
      lastActiveDate: streakRes.data?.last_active_date ?? null,
    },
    stats: {
      totalNotes: notes.length,
      totalWords,
      totalRecordings: statsRes.data?.total_recordings ?? 0,
      totalAIActions: statsRes.data?.total_ai_actions ?? 0,
    },
    dailyActivity,
    achievements,
  });
}
