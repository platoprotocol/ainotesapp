'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAI } from '@/hooks/useAI';
import type { ChatMessage } from '@/types';

interface AIChatPanelProps {
  noteTitle: string;
  noteBody: string;
  onClose: () => void;
}

export function AIChatPanel({ noteTitle, noteBody, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { loading, error, run } = useAI();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const nextMessages: ChatMessage[] = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');

    const response = await run({
      action: 'chat',
      title: noteTitle,
      body: noteBody,
      messages: nextMessages,
    });

    if (response?.result) {
      setMessages((prev) => [...prev, { role: 'assistant', content: response.result }]);
    }
  }, [input, loading, messages, noteTitle, noteBody, run]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col border-l border-amber-200 dark:border-stone-700',
          'bg-white dark:bg-stone-950',
          'w-72 flex-shrink-0'
        )
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A8.66 8.66 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Ask AI</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="rounded p-0.5 text-gray-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            Ask anything about this note.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={twMerge(
              clsx(
                'max-w-[90%] rounded-xl px-3 py-2 text-sm',
                msg.role === 'user'
                  ? 'ml-auto bg-amber-600 text-white'
                  : 'mr-auto bg-amber-50 dark:bg-stone-800 text-slate-800 dark:text-slate-200'
              )
            )}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-auto flex items-center gap-1.5 rounded-xl bg-amber-50 dark:bg-stone-800 px-3 py-2">
            <Spinner className="h-3.5 w-3.5 text-orange-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-amber-200 dark:border-stone-700 p-2">
        <div className="flex items-end gap-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question… (Enter to send)"
            rows={2}
            className={twMerge(
              clsx(
                'flex-1 resize-none rounded-lg border border-amber-200 dark:border-stone-700',
                'bg-white dark:bg-stone-900 px-2.5 py-1.5',
                'text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400',
                'focus:outline-none focus:ring-1 focus:ring-amber-500'
              )
            )}
          />
          <Button
            variant="primary"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-auto rounded-lg px-2 py-1.5 text-xs"
            aria-label="Send message"
          >
            {loading ? (
              <Spinner className="h-3.5 w-3.5 text-white" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
