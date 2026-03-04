'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getNotesPaged } from '@/lib/notes';
import type { Note } from '@/types';

const PAGE_SIZE = 20;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(0);

  const fetchNotes = useCallback(async (reset = false) => {
    const currentPage = reset ? 0 : pageRef.current;
    try {
      const data = await getNotesPaged(currentPage, PAGE_SIZE);
      if (reset) {
        setNotes(data);
        pageRef.current = 0;
        setPage(0);
      } else {
        setNotes((prev) => (currentPage === 0 ? data : [...prev, ...data]));
      }
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback((note: Note) => {
    setNotes((prev) => [note, ...prev]);
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Patch a note's title/body in the list immediately — no DB round-trip needed.
  // Called from NoteEditor on every keystroke so sidebar + dashboard stay in sync.
  const updateNoteInList = useCallback((id: string, updates: Partial<Pick<Note, 'title' | 'body'>>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }, []);

  const loadMore = useCallback(async () => {
    const next = pageRef.current + 1;
    pageRef.current = next;
    setPage(next);
    try {
      const data = await getNotesPaged(next, PAGE_SIZE);
      setNotes((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    }
  }, []);

  useEffect(() => {
    fetchNotes(true);

    const supabase = createClient();

    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notes' },
        (payload) => {
          setNotes((prev) => prev.filter((n) => n.id !== (payload.old as { id: string }).id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notes' },
        (payload) => {
          const incoming = payload.new as Note;
          // Only add if not already present (addNote handles the optimistic case)
          setNotes((prev) => prev.some((n) => n.id === incoming.id) ? prev : [incoming, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notes' },
        (payload) => {
          const incoming = payload.new as Note;
          // Patch in-place rather than refetching — faster and no flicker
          if (incoming?.id) {
            setNotes((prev) => prev.map((n) => (n.id === incoming.id ? { ...n, ...incoming } : n)));
          } else {
            fetchNotes(true); // fallback if payload lacks data
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotes]);

  return { notes, loading, error, hasMore, loadMore, page, addNote, removeNote, updateNoteInList, refetch: () => fetchNotes(true) };
}
