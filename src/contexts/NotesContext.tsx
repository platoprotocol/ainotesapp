'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useNotes } from '@/hooks/useNotes';
import type { Note } from '@/types';

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadMore: () => Promise<void>;
  refetch: () => void;
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  updateNoteInList: (id: string, updates: Partial<Pick<Note, 'title' | 'body'>>) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const value = useNotes();
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotesContext(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotesContext must be used inside NotesProvider');
  return ctx;
}
