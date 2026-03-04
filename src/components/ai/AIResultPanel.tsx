'use client';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { AIAction } from '@/types';

interface AIResultPanelProps {
  action: AIAction | null;
  result: string | null;
  tags: string[] | null;
  loading: boolean;
  error: string | null;
  onApply: () => void;
  onDismiss: () => void;
}

const ACTION_LABELS: Record<AIAction, string> = {
  summarize: 'Summary',
  improve: 'Improved writing',
  'generate-title': 'Suggested title',
  'smart-tags': 'Suggested tags',
  expand: 'Continued writing',
};

const APPLY_LABELS: Record<AIAction, string> = {
  summarize: 'Append to note',
  improve: 'Replace body',
  'generate-title': 'Use as title',
  'smart-tags': 'Append tags',
  expand: 'Append to note',
};

export function AIResultPanel({ action, result, tags, loading, error, onApply, onDismiss }: AIResultPanelProps) {
  if (!loading && result === null && error === null) return null;

  return (
    <div className="border-b border-wire bg-accent/5 px-4 py-3 md:px-12">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
          {action ? ACTION_LABELS[action] : 'AI'}
        </span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded p-1 text-ink/30 hover:text-ink hover:bg-wire/30 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-ink/50">
          <Spinner className="h-4 w-4 text-accent" />
          <span>Thinking…</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && action === 'smart-tags' && tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {!loading && !error && action !== 'smart-tags' && result && (
        <p className="text-sm text-ink/80 whitespace-pre-wrap mb-3 max-h-40 overflow-y-auto leading-relaxed">
          {result}
        </p>
      )}

      {!loading && !error && result && action && (
        <div className="flex items-center gap-2">
          <Button variant="primary" className="text-xs px-3 py-1.5 h-auto" onClick={onApply}>
            {APPLY_LABELS[action]}
          </Button>
          <Button variant="ghost" className="text-xs px-3 py-1.5 h-auto" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
