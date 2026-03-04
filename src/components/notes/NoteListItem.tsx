'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { deleteNote } from '@/lib/notes';
import { useNotesContext } from '@/contexts/NotesContext';
import type { Note } from '@/types';

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function NoteListItem({ note }: { note: Note }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === `/notes/${note.id}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { removeNote } = useNotesContext();

  const title = note.title.trim() || 'Untitled';
  const preview = note.body.trim().slice(0, 65) || 'No content yet';

  async function handleDelete() {
    setDeleting(true);
    setDeleteOpen(false);
    removeNote(note.id);
    if (isActive) router.push('/notes');
    try {
      await deleteNote(note.id);
    } catch {
      toast.error('Failed to delete note');
    }
    setDeleting(false);
  }

  return (
    <>
      <div
        className={`group relative flex flex-col rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${
          isActive
            ? 'bg-accent/10 border border-accent/20'
            : 'hover:bg-wire/20 border border-transparent'
        }`}
      >
        <Link href={`/notes/${note.id}`} className="min-w-0 block">
          <p className={`truncate text-sm font-medium ${isActive ? 'text-accent' : 'text-ink'}`}>
            {title}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink/40">{preview}</p>
          <p className="mt-1 text-[11px] text-ink/25">{relativeTime(note.updated_at)}</p>
        </Link>

        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen((o) => !o); }}
          className="absolute right-2 top-2.5 hidden rounded p-1 text-ink/25 hover:bg-wire/40 hover:text-ink/60 group-hover:flex"
          aria-label="Note options"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-2 top-8 z-20 rounded-lg border border-wire bg-white py-1 shadow-md">
              <button
                className="w-full px-4 py-1.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => { setMenuOpen(false); setDeleteOpen(true); }}
              >
                Delete note
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        open={deleteOpen}
        title="Delete note"
        description={`"${title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </>
  );
}
