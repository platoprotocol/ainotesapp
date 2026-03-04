'use client';

import Link from 'next/link';
import { useNotesContext } from '@/contexts/NotesContext';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { NewNoteButton } from '@/components/notes/NewNoteButton';

// Accent bar tints derived from #6D8196
const TINTS = [
  'bg-[#6D8196]',
  'bg-[#8BA0B5]',
  'bg-[#5A6E80]',
  'bg-[#7A9BAE]',
  'bg-[#4A5E6D]',
  'bg-[#9DB3C4]',
];

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function wordCount(body: string): string {
  const n = body.trim() === '' ? 0 : body.trim().split(/\s+/).length;
  if (n === 0) return 'empty';
  return `${n}w`;
}

export function NotesDashboard() {
  const { notes, loading, error, hasMore, loadMore } = useNotesContext();
  const { user } = useAuth();

  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'there';

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-paper">
        <Spinner className="h-5 w-5 text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-paper p-8 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-paper">

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm border-b border-wire px-6 md:px-10 py-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-ink/40 font-medium uppercase tracking-widest mb-1">{greeting()}</p>
          <h1 className="text-2xl font-bold text-ink">{name}</h1>
          <p className="text-xs text-ink/40 mt-1">
            {notes.length === 0
              ? 'No notes yet'
              : `${notes.length}${hasMore ? '+' : ''} note${notes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <NewNoteButton className="shrink-0 bg-accent text-white hover:bg-accent-deep border-0" />
      </div>

      {/* Body */}
      <div className="flex-1 px-6 md:px-10 py-8">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-64 gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wire/30">
              <svg className="h-7 w-7 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Your canvas is empty</h2>
              <p className="mt-1.5 text-sm text-ink/40 max-w-xs">
                Create your first note and start capturing ideas.
              </p>
            </div>
            <NewNoteButton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note, idx) => {
                const accent = TINTS[idx % TINTS.length];
                const title = note.title.trim() || 'Untitled';

                return (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="group flex flex-col rounded-xl border border-wire bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden"
                  >
                    {/* Accent stripe */}
                    <div className={`h-1 w-full ${accent}`} />

                    {/* Content */}
                    <div className="flex flex-col flex-1 px-4 pt-3 pb-2">
                      <p className="text-sm font-semibold text-ink line-clamp-2 leading-snug">
                        {title}
                      </p>
                      {note.body.trim() && (
                        <p className="mt-1.5 text-xs text-ink/50 line-clamp-3 leading-relaxed">
                          {note.body}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3 pt-1 flex items-center justify-between text-[11px] text-ink/25">
                      <span>{relativeTime(note.updated_at)}</span>
                      <span>{wordCount(note.body)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="rounded-lg px-6 py-2 text-sm text-accent border border-wire hover:bg-accent/5 transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
