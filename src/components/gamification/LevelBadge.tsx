'use client';

import type { GamificationStats } from '@/types';

interface Props {
  data: GamificationStats;
  compact?: boolean;
}

export function LevelBadge({ data, compact = false }: Props) {
  const { xp, level, levelTitle, xpProgress, xpForNext, xpForCurrent } = data;
  const xpInLevel = xp - xpForCurrent;
  const xpNeeded = xpForNext - xpForCurrent;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
          Lv {level}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-wire overflow-hidden min-w-12">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${Math.min(xpProgress * 100, 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-ink/50 shrink-0">{xp} XP</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-wire bg-wire/10 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink/40 uppercase tracking-widest font-medium">Level {level}</p>
          <p className="text-lg font-bold text-ink">{levelTitle}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-xl font-bold text-accent">{level}</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-ink/40 mb-1">
          <span>{xpInLevel} / {xpNeeded} XP to next level</span>
          <span>{xp} total XP</span>
        </div>
        <div className="h-2 rounded-full bg-wire overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${Math.min(xpProgress * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
