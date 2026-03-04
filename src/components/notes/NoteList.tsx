'use client';

import { useNotesContext } from '@/contexts/NotesContext';
import { NoteListItem } from './NoteListItem';
import { Spinner } from '@/components/ui/Spinner';

interface NoteListProps {
  search?: string;
}

export function NoteList({ search = '' }: NoteListProps) {
  const { notes, loading, error, hasMore, loadMore } = useNotesContext();

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner className="h-4 w-4 text-accent" /></div>;
  }

  if (error) {
    return <p className="px-4 py-4 text-sm text-red-500">{error}</p>;
  }

  const q = search.toLowerCase();
  const filtered = search
    ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
    : notes;

  if (notes.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-xs text-ink/30">
        No notes yet.
      </p>
    );
  }

  if (filtered.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-ink/30">
        No matches for &ldquo;{search}&rdquo;
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {search && (
        <p className="px-3 pb-1 text-[11px] text-ink/40">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
      <ul className="flex flex-col gap-0.5 px-2 py-1">
        {filtered.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} />
          </li>
        ))}
      </ul>
      {hasMore && !search && (
        <button
          onClick={loadMore}
          className="mx-3 mb-2 rounded-lg py-1.5 text-xs text-accent hover:bg-accent/5 transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
