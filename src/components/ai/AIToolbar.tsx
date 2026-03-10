'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '@/components/ui/Spinner';
import type { AIAction } from '@/types';

interface AIToolbarProps {
  loading: boolean;
  chatOpen: boolean;
  onAction: (action: AIAction) => void;
  onChatToggle: () => void;
  onTranscribe: () => void;
  recordingState: 'idle' | 'recording' | 'processing';
}

interface ActionItem {
  action: AIAction;
  label: string;
  description: string;
}

const ACTIONS: ActionItem[] = [
  { action: 'improve',    label: 'Improve writing', description: 'Better grammar & clarity' },
  { action: 'smart-tags', label: 'Smart tags',      description: '3–5 relevant tags' },
  { action: 'expand',     label: 'Expand',          description: 'Continue writing' },
];

export function AIToolbar({ loading, chatOpen, onAction, onChatToggle, onTranscribe, recordingState }: AIToolbarProps) {
  const [open, setOpen] = useState(false);

  const btnBase = 'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex items-center gap-0.5">

      {/* Transcribe */}
      <button
        onClick={onTranscribe}
        disabled={recordingState !== 'idle' || loading}
        aria-label="Transcribe audio"
        className={twMerge(btnBase, clsx(
          recordingState !== 'idle'
            ? 'bg-red-100 text-red-600'
            : 'text-ink/50 hover:bg-wire/30 hover:text-ink'
        ))}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        {recordingState === 'recording' ? 'Recording…' : 'Voice'}
      </button>

      {/* Chat */}
      <button
        onClick={onChatToggle}
        aria-label="Toggle AI chat"
        className={twMerge(btnBase, clsx(
          chatOpen
            ? 'bg-accent/10 text-accent'
            : 'text-ink/50 hover:bg-wire/30 hover:text-ink'
        ))}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A8.66 8.66 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>

      {/* AI actions popover */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="AI tools"
          className={twMerge(btnBase, 'text-accent hover:bg-accent/10')}
        >
          {loading
            ? <Spinner className="h-3.5 w-3.5 text-accent" />
            : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )}
          AI
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-9 z-20 w-52 rounded-xl border border-wire bg-paper py-1 shadow-lg">
              {ACTIONS.map(({ action, label, description }) => (
                <button
                  key={action}
                  onClick={() => { setOpen(false); onAction(action); }}
                  disabled={loading}
                  className="flex w-full flex-col px-3 py-2.5 text-left hover:bg-paper disabled:opacity-40 transition-colors"
                >
                  <span className="text-sm font-medium text-ink">{label}</span>
                  <span className="text-xs text-ink/50">{description}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
