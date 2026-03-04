'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteList } from '@/components/notes/NoteList';
import { NewNoteButton } from '@/components/notes/NewNoteButton';
import { UpgradeModal } from '@/components/billing/UpgradeModal';
import { useAuth } from '@/hooks/useAuth';
import { useUserPlan } from '@/hooks/useUserPlan';
import { signOut } from '@/lib/auth';
import { FREE_TIER_LIMIT } from '@/types';

export function Sidebar() {
  const [search, setSearch] = useState('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { plan, usage, loading: planLoading } = useUserPlan();
  const router = useRouter();

  // Treat missing plan row as free tier
  const isPro = plan?.plan === 'pro';
  const usageCount = usage?.count ?? 0;
  const usagePct = Math.min((usageCount / FREE_TIER_LIMIT) * 100, 100);
  const nearLimit = usageCount >= FREE_TIER_LIMIT - 5;
  const email = user?.email ?? '';

  // Cmd/Ctrl+K focuses search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch('');
    searchRef.current?.focus();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push('/login');
    router.refresh();
  }

  async function handleManageBilling() {
    setBillingLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setBillingLoading(false);
    }
  }

  return (
    <>
      <aside className="flex h-full w-full flex-col bg-white border-r border-wire">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-wire">
          <Link href="/notes" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <svg className="h-4 w-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm font-semibold text-ink tracking-tight">Logan&apos;s List</span>
          </Link>
        </div>

        {/* New note */}
        <div className="px-3 pt-3 pb-2">
          <NewNoteButton />
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative group">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink/30 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search  ⌘K"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-paper border border-wire pl-8 pr-7 py-1.5 text-sm text-ink placeholder:text-ink/25 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-colors"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Note list */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <NoteList search={search} />
        </div>

        {/* Bottom: billing + account */}
        <div className="border-t border-wire">

          {/* Billing section — always show once plan data is loaded (null plan = free) */}
          {!planLoading && (
            <div className="px-3 py-3">
              {isPro ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                      PRO
                    </span>
                    <span className="text-xs text-ink/40">Active</span>
                  </div>
                  <button
                    onClick={handleManageBilling}
                    disabled={billingLoading}
                    className="text-xs text-accent hover:underline disabled:opacity-50 transition-colors"
                  >
                    {billingLoading ? 'Loading…' : 'Manage billing'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-ink/40">{usageCount} / {FREE_TIER_LIMIT} AI requests</span>
                    <button
                      onClick={() => setUpgradeOpen(true)}
                      className="text-xs font-medium text-accent hover:underline transition-colors"
                    >
                      Upgrade →
                    </button>
                  </div>
                  <div className="h-1 w-full rounded-full bg-wire overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${nearLimit ? 'bg-red-400' : 'bg-accent'}`}
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User row */}
          <div className="border-t border-wire px-3 py-2.5 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-ink/40 min-w-0">{email}</p>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 text-xs text-ink/30 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {signingOut ? '…' : 'Sign out'}
            </button>
          </div>
        </div>
      </aside>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} trigger="manual" />
    </>
  );
}
