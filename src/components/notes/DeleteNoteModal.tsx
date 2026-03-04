'use client';

import { Button } from '@/components/ui/Button';

interface DeleteNoteModalProps {
  open: boolean;
  noteTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export function DeleteNoteModal({ open, noteTitle, onConfirm, onClose, loading }: DeleteNoteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white border border-wire shadow-xl p-6">
        <h2 className="text-base font-semibold text-ink">Delete note?</h2>
        {noteTitle && (
          <p className="mt-1 text-sm text-ink/70 truncate">&ldquo;{noteTitle}&rdquo;</p>
        )}
        <p className="mt-2 text-sm text-red-500">This cannot be undone.</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
