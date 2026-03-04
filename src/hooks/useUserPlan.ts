'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserPlan, AIUsage } from '@/types';

interface UseUserPlanReturn {
  plan: UserPlan | null;
  usage: AIUsage | null;
  loading: boolean;
  refetch: () => void;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function useUserPlan(): UseUserPlanReturn {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const [{ data: planData }, { data: usageData }] = await Promise.all([
      supabase.from('user_plans').select('*').single(),
      supabase
        .from('ai_usage')
        .select('*')
        .eq('month', currentMonth())
        .maybeSingle(),
    ]);

    setPlan(planData ?? null);
    setUsage(usageData ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plan, usage, loading, refetch: fetch };
}
