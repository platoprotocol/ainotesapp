'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';

interface RecordingBarProps {
  state: 'recording' | 'processing';
  onStop: () => void;
}

export function RecordingBar({ state, onStop }: RecordingBarProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (state !== 'recording') { setElapsed(0); return; }
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-lg px-4 py-2.5 mx-4 mb-1">
      {state === 'recording' ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-sm font-medium text-red-700 tabular-nums">{mm}:{ss}</span>
          <span className="flex-1 text-xs text-red-500">Recording…</span>
          <button
            onClick={onStop}
            className="rounded px-3 py-1 text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        </>
      ) : (
        <>
          <Spinner className="h-3.5 w-3.5 text-red-500" />
          <span className="text-sm text-red-700">Transcribing…</span>
        </>
      )}
    </div>
  );
}
