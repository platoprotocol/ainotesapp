'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { getNote, updateNote, deleteNote } from '@/lib/notes';
import { apiUrl } from '@/lib/apiUrl';
import type { Note } from '@/types';

function awardStreak() {
  const key = 'gam_streak_date';
  const today = new Date().toISOString().split('T')[0];
  try {
    if (localStorage.getItem(key) === today) return;
    localStorage.setItem(key, today);
  } catch {
    // localStorage unavailable — proceed
  }
  fetch(apiUrl('/api/gamification/award'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'note_saved' }),
  }).catch(() => {});
}

export function useNote(id: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getNote(id)
      .then((data) => {
        setNote(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load note');
        setLoading(false);
      });
  }, [id]);

  const update = useCallback(
    (updates: Partial<Pick<Note, 'title' | 'body'>>) => {
      setNote((prev) => (prev ? { ...prev, ...updates } : prev));
      setSaveStatus('saving');

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await updateNote(id, updates);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
          awardStreak();
        } catch {
          setSaveStatus('idle');
          toast.error('Failed to save note');
        }
      }, 800);
    },
    [id]
  );

  const remove = useCallback(async () => {
    try {
      await deleteNote(id);
    } catch (err) {
      toast.error('Failed to delete note');
      throw err;
    }
  }, [id]);

  return { note, loading, saveStatus, update, remove };
}
