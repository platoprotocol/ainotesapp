// Server-only — uses supabaseAdmin
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  ACHIEVEMENTS,
  LEVEL_THRESHOLDS,
  XP_VALUES,
  getLevelFromXP,
  getXPForLevel,
} from '@/lib/gamification-config';

export type GamificationAction = 'create_note' | 'transcribe' | 'ai_action' | 'note_saved';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ActionResult {
  xp: number;
  level: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
}

export async function processAction(userId: string, action: GamificationAction): Promise<ActionResult> {
  const today = new Date().toISOString().split('T')[0];

  const [xpRes, streakRes, statsRes, achievementsRes] = await Promise.all([
    supabaseAdmin.from('user_xp').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('user_streaks').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('user_stats').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('user_achievements').select('achievement_id').eq('user_id', userId),
  ]);

  const currentXP = xpRes.data?.xp ?? 0;
  const currentLevel = xpRes.data?.level ?? 1;
  const currentStreak = streakRes.data?.current_streak ?? 0;
  const longestStreak = streakRes.data?.longest_streak ?? 0;
  const lastActiveDate = streakRes.data?.last_active_date ?? null;
  const currentStats = statsRes.data ?? { total_recordings: 0, total_ai_actions: 0 };
  const unlockedIds = new Set((achievementsRes.data ?? []).map((a) => a.achievement_id));

  // XP calculation
  const baseXP = action === 'note_saved' ? 0 : (XP_VALUES[action] ?? 0);
  const isFirstActionToday = lastActiveDate !== today;
  const dailyBonusXP = isFirstActionToday ? XP_VALUES.daily_active : 0;
  const newXP = currentXP + baseXP + dailyBonusXP;
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > currentLevel;

  // Streak calculation
  let newStreak = currentStreak;
  if (isFirstActionToday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (lastActiveDate === yesterdayStr) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }
  const newLongestStreak = Math.max(longestStreak, newStreak);

  // Stats counters
  const newStats = { ...currentStats };
  if (action === 'transcribe') newStats.total_recordings = (currentStats.total_recordings ?? 0) + 1;
  if (action === 'ai_action') newStats.total_ai_actions = (currentStats.total_ai_actions ?? 0) + 1;

  // Write updates (run sequentially to avoid TS PromiseLike issues with Supabase builder)
  await supabaseAdmin.from('user_xp').upsert({ user_id: userId, xp: newXP, level: newLevel, updated_at: new Date().toISOString() });

  if (isFirstActionToday) {
    await supabaseAdmin.from('user_streaks').upsert({
      user_id: userId,
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    });
  }

  if (action === 'transcribe' || action === 'ai_action') {
    await supabaseAdmin.from('user_stats').upsert({
      user_id: userId,
      ...newStats,
      updated_at: new Date().toISOString(),
    });
  }

  // Check achievements
  const { count: noteCount } = await supabaseAdmin
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const totalNotes = noteCount ?? 0;
  const totalRecordings = newStats.total_recordings ?? 0;
  const totalAIActions = newStats.total_ai_actions ?? 0;

  const toUnlock: string[] = [];

  if (totalNotes >= 1   && !unlockedIds.has('first_note'))    toUnlock.push('first_note');
  if (totalNotes >= 10  && !unlockedIds.has('notes_10'))     toUnlock.push('notes_10');
  if (totalNotes >= 50  && !unlockedIds.has('notes_50'))     toUnlock.push('notes_50');
  if (totalNotes >= 100 && !unlockedIds.has('notes_100'))    toUnlock.push('notes_100');

  if (newStreak >= 3  && !unlockedIds.has('streak_3'))  toUnlock.push('streak_3');
  if (newStreak >= 7  && !unlockedIds.has('streak_7'))  toUnlock.push('streak_7');
  if (newStreak >= 30 && !unlockedIds.has('streak_30')) toUnlock.push('streak_30');

  if (totalRecordings >= 1  && !unlockedIds.has('transcribe_1'))  toUnlock.push('transcribe_1');
  if (totalRecordings >= 10 && !unlockedIds.has('transcribe_10')) toUnlock.push('transcribe_10');

  if (totalAIActions >= 10 && !unlockedIds.has('ai_10')) toUnlock.push('ai_10');
  if (totalAIActions >= 50 && !unlockedIds.has('ai_50')) toUnlock.push('ai_50');

  if (newLevel >= 5  && !unlockedIds.has('level_5'))  toUnlock.push('level_5');
  if (newLevel >= 10 && !unlockedIds.has('level_10')) toUnlock.push('level_10');

  if (toUnlock.length > 0) {
    await supabaseAdmin.from('user_achievements').upsert(
      toUnlock.map((id) => ({ user_id: userId, achievement_id: id }))
    );
  }

  return {
    xp: newXP,
    level: newLevel,
    leveledUp,
    newAchievements: toUnlock.map((id) => ({ id, ...ACHIEVEMENTS[id] })),
  };
}

export async function checkWordAchievements(userId: string, totalWords: number): Promise<Achievement[]> {
  const { data: existing } = await supabaseAdmin
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedIds = new Set((existing ?? []).map((a) => a.achievement_id));
  const toUnlock: string[] = [];

  if (totalWords >= 1000   && !unlockedIds.has('words_1k'))   toUnlock.push('words_1k');
  if (totalWords >= 10000  && !unlockedIds.has('words_10k'))  toUnlock.push('words_10k');
  if (totalWords >= 100000 && !unlockedIds.has('words_100k')) toUnlock.push('words_100k');

  if (toUnlock.length > 0) {
    await supabaseAdmin.from('user_achievements').upsert(
      toUnlock.map((id) => ({ user_id: userId, achievement_id: id }))
    );
  }

  return toUnlock.map((id) => ({ id, ...ACHIEVEMENTS[id] }));
}

export { getLevelFromXP, getXPForLevel, LEVEL_THRESHOLDS };
