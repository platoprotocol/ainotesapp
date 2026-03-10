'use client';

import { useGamification } from '@/hooks/useGamification';
import { LevelBadge } from './LevelBadge';
import { StreakBadge } from './StreakBadge';
import { AchievementBadge } from './AchievementBadge';
import { ACHIEVEMENTS } from '@/lib/gamification-config';
import { Spinner } from '@/components/ui/Spinner';

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border border-wire bg-wire/10 p-4">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-2xl font-bold text-ink">{value.toLocaleString()}</p>
      <p className="text-xs text-ink/60 mt-0.5">{label}</p>
    </div>
  );
}

function ActivityChart({ dailyActivity }: { dailyActivity: Record<string, number> }) {
  // Build last 30 days
  const days: { date: string; label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      count: dailyActivity[dateStr] ?? 0,
    });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-wire bg-wire/10 p-4">
      <p className="text-sm font-semibold text-ink mb-4">Activity — last 30 days</p>
      <div className="flex items-end gap-1 h-20">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-0.5 group relative"
          >
            <div
              className="w-full rounded-t-sm bg-accent/70 group-hover:bg-accent transition-colors"
              style={{ height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 8 : 2)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="rounded bg-ink text-paper text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                {day.count} note{day.count !== 1 ? 's' : ''} · {day.label}
              </div>
              <div className="w-1.5 h-1.5 bg-ink rotate-45 -mt-0.5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-ink/25">
        <span>{days[0].label}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function StatsPage() {
  const { data, loading } = useGamification();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-paper">
        <Spinner className="h-5 w-5 text-accent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center bg-paper">
        <p className="text-sm text-ink/40">Failed to load stats</p>
      </div>
    );
  }

  const unlockedIds = new Set(data.achievements.map((a) => a.id));
  const allAchievements = Object.entries(ACHIEVEMENTS).map(([id, def]) => ({
    id,
    ...def,
    unlockedAt: data.achievements.find((a) => a.id === id)?.unlockedAt,
  }));

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-paper">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm border-b border-wire px-6 md:px-10 py-5">
        <p className="text-xs text-ink/40 font-medium uppercase tracking-widest mb-1">Your Progress</p>
        <h1 className="text-2xl font-bold text-ink">Stats & Achievements</h1>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-8">
        {/* Level + Streak row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LevelBadge data={data} />
          <div className="rounded-xl border border-wire bg-wire/10 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <StreakBadge current={data.streak.current} />
              <div className="border-l border-wire pl-4">
                <p className="text-lg font-bold text-ink">{data.streak.longest}</p>
                <p className="text-xs text-ink/40">longest streak</p>
              </div>
            </div>
            <p className="text-[11px] text-ink/30">
              {data.streak.lastActiveDate
                ? `Last active: ${new Date(data.streak.lastActiveDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'No activity yet'}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="notes created" value={data.stats.totalNotes} icon="📝" />
          <StatCard label="words written" value={data.stats.totalWords} icon="✍️" />
          <StatCard label="recordings" value={data.stats.totalRecordings} icon="🎙️" />
          <StatCard label="AI uses" value={data.stats.totalAIActions} icon="🤖" />
        </div>

        {/* Activity chart */}
        <ActivityChart dailyActivity={data.dailyActivity} />

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-ink">Achievements</p>
            <p className="text-xs text-ink/40">
              {unlockedIds.size} / {allAchievements.length} unlocked
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allAchievements.map((a) => (
              <AchievementBadge
                key={a.id}
                achievement={a}
                unlocked={unlockedIds.has(a.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
