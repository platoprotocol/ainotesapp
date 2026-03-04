'use client';

import { useState, useCallback } from 'react';
import type { AIAction, AIResponse, ChatMessage } from '@/types';

interface UseAIState {
  result: string | null;
  tags: string[] | null;
  loading: boolean;
  error: string | null;
}

interface RunParams {
  action: AIAction | 'chat';
  title: string;
  body: string;
  messages?: ChatMessage[];
}

export interface UseAIReturn extends UseAIState {
  run: (params: RunParams) => Promise<AIResponse | null>;
  clear: () => void;
}

const initialState: UseAIState = {
  result: null,
  tags: null,
  loading: false,
  error: null,
};

export function useAI(): UseAIReturn {
  const [state, setState] = useState<UseAIState>(initialState);

  const run = useCallback(async ({ action, title, body, messages }: RunParams): Promise<AIResponse | null> => {
    setState({ result: null, tags: null, loading: true, error: null });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, title, body, messages }),
      });

      const data: AIResponse = await res.json();

      if (!res.ok || data.error) {
        const errorMsg = data.error ?? `Request failed (${res.status})`;
        setState({ result: null, tags: null, loading: false, error: errorMsg });
        return null;
      }

      setState({
        result: data.result,
        tags: data.tags ?? null,
        loading: false,
        error: null,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      setState({ result: null, tags: null, loading: false, error: message });
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  return { ...state, run, clear };
}
