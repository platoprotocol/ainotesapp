import { NewNoteButton } from './NewNoteButton';

export function NoteEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-stone-900">
        <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">No note selected</h2>
        <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500 max-w-xs">
          Pick a note from the sidebar or create a new one to get started.
        </p>
      </div>
      <NewNoteButton />
    </div>
  );
}
