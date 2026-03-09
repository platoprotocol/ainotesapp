'use client';

import type { Achievement } from '@/types';

interface Props {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all ${
        unlocked
          ? 'border-accent/30 bg-accent/5'
          : 'border-wire bg-white opacity-40 grayscale'
      }`}
      title={unlocked ? achievement.description : `Locked: ${achievement.description}`}
    >
      <span className="text-3xl">{achievement.icon}</span>
      <div>
        <p className="text-xs font-semibold text-ink leading-snug">{achievement.name}</p>
        <p className="text-[11px] text-ink/40 leading-snug mt-0.5">{achievement.description}</p>
      </div>
      {unlocked && achievement.unlockedAt && (
        <p className="text-[10px] text-accent/60">
          {new Date(achievement.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}
