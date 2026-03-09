'use client';

interface Props {
  current: number;
  compact?: boolean;
}

export function StreakBadge({ current, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs text-ink/50">
        <span>{current > 0 ? '🔥' : '💤'}</span>
        <span className="font-medium">{current}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-wire bg-white p-4 flex items-center gap-4">
      <div className="text-4xl">{current > 0 ? '🔥' : '💤'}</div>
      <div>
        <p className="text-2xl font-bold text-ink">{current}</p>
        <p className="text-xs text-ink/40">{current === 1 ? '1-day streak' : `${current}-day streak`}</p>
      </div>
    </div>
  );
}
