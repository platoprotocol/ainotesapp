'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createNote } from '@/lib/notes';
import { useNotesContext } from '@/contexts/NotesContext';

export function NewNoteButton({ className }: { className?: string }) {
  const router = useRouter();
  const { addNote } = useNotesContext();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const note = await createNote();
      addNote(note); // instant sidebar/dashboard update
      router.push(`/notes/${note.id}`);
    } catch {
      toast.error('Failed to create note');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-accent text-white hover:bg-accent-deep disabled:opacity-50 transition-colors ${className ?? 'w-full'}`}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {loading ? 'Creating…' : 'New note'}
    </button>
  );
}
