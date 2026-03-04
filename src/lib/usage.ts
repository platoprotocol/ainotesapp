import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FREE_TIER_LIMIT } from '@/types';

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function getUserPlan(userId: string): Promise<'free' | 'pro'> {
  const { data } = await supabaseAdmin
    .from('user_plans')
    .select('plan')
    .eq('user_id', userId)
    .single();

  if (!data) {
    // Create default free plan row
    await supabaseAdmin
      .from('user_plans')
      .upsert({ user_id: userId, plan: 'free' }, { onConflict: 'user_id' });
    return 'free';
  }

  return data.plan as 'free' | 'pro';
}

async function getUsageCount(userId: string, month: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();
  return data?.count ?? 0;
}

async function incrementUsage(userId: string, month: string): Promise<number> {
  // Try to get existing row
  const { data: existing } = await supabaseAdmin
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  if (existing) {
    const newCount = existing.count + 1;
    await supabaseAdmin
      .from('ai_usage')
      .update({ count: newCount })
      .eq('user_id', userId)
      .eq('month', month);
    return newCount;
  } else {
    await supabaseAdmin
      .from('ai_usage')
      .insert({ user_id: userId, month, count: 1 });
    return 1;
  }
}

export async function checkAndIncrementUsage(
  userId: string
): Promise<{ allowed: boolean; count: number; limit: number }> {
  const month = currentMonth();

  // Run plan fetch and usage count in parallel
  const [plan, currentCount] = await Promise.all([
    getUserPlan(userId),
    getUsageCount(userId, month),
  ]);

  if (plan === 'pro') {
    const count = await incrementUsage(userId, month);
    return { allowed: true, count, limit: Infinity };
  }

  // Free tier: check limit before incrementing
  if (currentCount >= FREE_TIER_LIMIT) {
    return { allowed: false, count: currentCount, limit: FREE_TIER_LIMIT };
  }

  const newCount = await incrementUsage(userId, month);
  return { allowed: true, count: newCount, limit: FREE_TIER_LIMIT };
}
