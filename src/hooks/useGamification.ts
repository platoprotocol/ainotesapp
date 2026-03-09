'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { apiUrl } from '@/lib/apiUrl';
import type { GamificationStats } from '@/types';

export type GamificationAction = 'create_note' | 'transcribe' | 'ai_action' | 'note_saved';

export function useGamification() {
  const [data, setData] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/gamification/stats'));
      if (res.ok) setData(await res.json());
    } catch {
      // silently fail — gamification is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const awardAction = useCallback(async (action: GamificationAction) => {
    // For note_saved (streak only), throttle to once per day via localStorage
    if (action === 'note_saved') {
      const key = 'gam_streak_date';
      const today = new Date().toISOString().split('T')[0];
      try {
        if (localStorage.getItem(key) === today) return;
        localStorage.setItem(key, today);
      } catch {
        // localStorage unavailable — proceed anyway
      }
    }

    try {
      const res = await fetch(apiUrl('/api/gamification/award'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) return;

      const result = await res.json();

      for (const achievement of result.newAchievements ?? []) {
        toast.success(`${achievement.icon} Achievement unlocked: ${achievement.name}`, {
          description: achievement.description,
          duration: 5000,
        });
      }

      if (result.leveledUp) {
        toast.success(`🎉 Level up! You're now level ${result.level}`, { duration: 4000 });
      }

      // Debounce stats refresh to avoid hammering the endpoint
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(fetchStats, 2000);
    } catch {
      // silently fail
    }
  }, [fetchStats]);

  return { data, loading, awardAction, refresh: fetchStats };
}
