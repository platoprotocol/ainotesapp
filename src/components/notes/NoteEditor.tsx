'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useNote } from '@/hooks/useNote';
import { useSettings } from '@/hooks/useSettings';
import { useAI } from '@/hooks/useAI';
import { useRecording } from '@/hooks/useRecording';
import { useNotesContext } from '@/contexts/NotesContext';
import { Spinner } from '@/components/ui/Spinner';
import { EditorSettingsPopover } from '@/components/notes/EditorSettingsPopover';
import { AIToolbar } from '@/components/ai/AIToolbar';
import { AIResultPanel } from '@/components/ai/AIResultPanel';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { RecordingBar } from '@/components/ai/RecordingBar';
import { UpgradeModal } from '@/components/billing/UpgradeModal';
import { DeleteNoteModal } from '@/components/notes/DeleteNoteModal';
import { apiUrl } from '@/lib/apiUrl';
import type { AIAction, Note } from '@/types';

export function NoteEditor({ noteId }: { noteId: string }) {
  const router = useRouter();
  const { note, loading, saveStatus, update, remove } = useNote(noteId);
  const { removeNote, updateNoteInList } = useNotesContext();

  // Every edit goes through here: saves to DB (debounced) AND patches the shared list immediately.
  const handleUpdate = useCallback(
    (updates: Partial<Pick<Note, 'title' | 'body'>>) => {
      update(updates);
      updateNoteInList(noteId, updates);
    },
    [update, updateNoteInList, noteId]
  );
  const { fontFamilyValue, resolvedColor } = useSettings();
  const titleRef = useRef<HTMLInputElement>(null);

  const { result, tags, loading: aiLoading, error, run, clear } = useAI();
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<'limit_reached' | 'manual'>('manual');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const autoTitledRef = useRef(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const [autoSummary, setAutoSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const lastSummarizedBodyRef = useRef('');
  const summaryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const summaryAbortRef = useRef<AbortController | null>(null);

  const onTranscript = useCallback(
    (text: string) => {
      if (note) handleUpdate({ body: (note.body ? note.body + '\n\n' : '') + text });
    },
    [note, handleUpdate]
  );
  const onLimitReached = useCallback(() => {
    setUpgradeTrigger('limit_reached');
    setUpgradeOpen(true);
  }, []);

  const { recordingState, handleTranscribe, handleStopRecording } = useRecording({ onTranscript, onLimitReached });

  const initialFocusDoneRef = useRef(false);
  useEffect(() => {
    if (!loading && note && note.title === '' && titleRef.current && !initialFocusDoneRef.current) {
      initialFocusDoneRef.current = true;
      titleRef.current.focus();
    }
  }, [loading, note]);

  useEffect(() => {
    clear();
    setActiveAction(null);
    autoTitledRef.current = false;
    initialFocusDoneRef.current = false;
    setAutoSummary(null);
    setSummaryOpen(true);
    lastSummarizedBodyRef.current = '';
    if (summaryDebounceRef.current) clearTimeout(summaryDebounceRef.current);
    summaryAbortRef.current?.abort();
    summaryAbortRef.current = null;
  }, [noteId, clear]);

  useEffect(() => {
    if (error === 'limit_reached') {
      setUpgradeTrigger('limit_reached');
      setUpgradeOpen(true);
      clear();
      setActiveAction(null);
    }
  }, [error, clear]);

  useEffect(() => {
    if (error && error !== 'limit_reached') toast.error('AI action failed');
  }, [error]);

  // Auto-title
  useEffect(() => {
    if (!note || autoTitledRef.current || note.title !== '' || (note.body ?? '').length <= 150) return;
    autoTitledRef.current = true;
    setIsGeneratingTitle(true);
    fetch(apiUrl('/api/ai'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate-title', skipUsage: true, title: '', body: note.body }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.result && !d.error) handleUpdate({ title: d.result }); else autoTitledRef.current = false; })
      .catch(() => { autoTitledRef.current = false; })
      .finally(() => setIsGeneratingTitle(false));
  }, [note?.body, note?.title, note, handleUpdate]);

  // Auto-summary
  useEffect(() => {
    if (summaryDebounceRef.current) clearTimeout(summaryDebounceRef.current);
    if (!note || note.body.length < 300) {
      if (note && note.body.length < 300) { setAutoSummary(null); lastSummarizedBodyRef.current = ''; }
      return;
    }
    const delta = Math.abs(note.body.length - lastSummarizedBodyRef.current.length);
    if (lastSummarizedBodyRef.current && delta < 200) return;

    summaryDebounceRef.current = setTimeout(async () => {
      summaryAbortRef.current?.abort();
      const ctrl = new AbortController();
      summaryAbortRef.current = ctrl;
      setSummaryLoading(true);
      try {
        const res = await fetch(apiUrl('/api/ai'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'summarize', skipUsage: true, title: note.title, body: note.body }),
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (data.result && !data.error) { setAutoSummary(data.result); lastSummarizedBodyRef.current = note.body; }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') { /* ignore */ }
      } finally { setSummaryLoading(false); }
    }, 3000);

    return () => { if (summaryDebounceRef.current) clearTimeout(summaryDebounceRef.current); };
  }, [note?.body, note?.title, note]);

  const handleAIAction = useCallback(async (action: AIAction) => {
    if (!note) return;
    setActiveAction(action);
    await run({ action, title: note.title, body: note.body });
  }, [note, run]);

  const handleApply = useCallback(() => {
    if (!note || !activeAction || !result) return;
    switch (activeAction) {
      case 'improve':     handleUpdate({ body: result }); break;
      case 'smart-tags':  handleUpdate({ body: note.body + '\n\nTags: ' + (tags ?? []).join(', ') }); break;
      case 'expand':      handleUpdate({ body: note.body + '\n\n' + result }); break;
    }
    clear(); setActiveAction(null);
  }, [note, activeAction, result, tags, handleUpdate, clear]);

  const handleDismiss = useCallback(() => { clear(); setActiveAction(null); }, [clear]);

  const handleDelete = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await remove();
      removeNote(noteId);
      router.push('/notes');
    } catch {
      // toast shown by useNote.remove()
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }, [remove, removeNote, noteId, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-paper">
        <Spinner className="h-5 w-5 text-accent" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center bg-paper">
        <p className="text-ink/40 text-sm">Note not found.</p>
        <Link href="/notes" className="text-sm text-accent hover:underline">Back to notes</Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-wire bg-white px-4 py-2.5">
            <Link
              href="/notes"
              className="md:hidden flex items-center gap-1 text-sm text-accent hover:opacity-70 transition-opacity"
              aria-label="Back"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Notes
            </Link>
            <span className="hidden md:block" />

            <div className="flex items-center gap-2">
              <AIToolbar
                loading={aiLoading}
                chatOpen={chatOpen}
                onAction={handleAIAction}
                onChatToggle={() => setChatOpen((o) => !o)}
                onTranscribe={handleTranscribe}
                recordingState={recordingState}
              />

              {/* Divider */}
              <div className="h-4 w-px bg-wire" />

              {/* Delete button */}
              <button
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete note"
                className="rounded-md p-1.5 text-ink/25 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <EditorSettingsPopover />

              {/* Save status */}
              <span className={`text-xs tabular-nums transition-opacity duration-300 ${
                saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'
              } ${saveStatus === 'saved' ? 'text-accent' : 'text-ink/30'}`}>
                {saveStatus === 'saving' ? 'Saving…' : 'Saved'}
              </span>
            </div>
          </div>

          {/* Recording bar */}
          {recordingState !== 'idle' && (
            <RecordingBar state={recordingState} onStop={handleStopRecording} />
          )}

          {/* AI result panel */}
          <AIResultPanel
            action={activeAction}
            result={result}
            tags={tags}
            loading={aiLoading}
            error={error}
            onApply={handleApply}
            onDismiss={handleDismiss}
          />

          {/* Editor area — cream paper feel */}
          <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 md:px-16 md:py-10 max-w-3xl w-full mx-auto">

            {/* Title row */}
            <div className="flex items-center gap-2 mb-6">
              <input
                ref={titleRef}
                type="text"
                placeholder="Untitled"
                value={note.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                style={{ fontFamily: fontFamilyValue, color: resolvedColor ?? '#4A4A4A' }}
                className="flex-1 text-2xl font-bold placeholder:text-ink/20 focus:outline-none bg-transparent text-ink"
              />
              {isGeneratingTitle && <Spinner className="h-3.5 w-3.5 text-accent shrink-0" />}
            </div>

            {/* Auto-summary */}
            {(summaryLoading || autoSummary) && (
              <div className="mb-6 rounded-xl border border-wire bg-white">
                <button
                  onClick={() => setSummaryOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">AI Summary</span>
                    {summaryLoading && <Spinner className="h-3 w-3 text-accent" />}
                  </div>
                  <svg className={`h-3.5 w-3.5 text-ink/30 transition-transform ${summaryOpen ? '' : '-rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {summaryOpen && !summaryLoading && autoSummary && (
                  <p className="px-4 pb-3 text-sm leading-relaxed text-ink/60">{autoSummary}</p>
                )}
              </div>
            )}

            {/* Body */}
            <textarea
              placeholder="Start writing…"
              value={note.body}
              onChange={(e) => handleUpdate({ body: e.target.value })}
              style={{ fontFamily: fontFamilyValue, color: resolvedColor ?? '#4A4A4A' }}
              className="flex-1 resize-none text-base placeholder:text-ink/20 focus:outline-none bg-transparent leading-relaxed min-h-[60vh] text-ink"
            />
          </div>
        </div>

        {chatOpen && (
          <AIChatPanel noteTitle={note.title} noteBody={note.body} onClose={() => setChatOpen(false)} />
        )}
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} trigger={upgradeTrigger} />
      <DeleteNoteModal
        open={deleteOpen}
        noteTitle={note.title}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}
