'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';

export function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = user?.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    setLoading(true);
    await signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-800 py-1 shadow-lg dark:shadow-black/40">
            <div className="border-b border-amber-100 dark:border-stone-700 px-3 py-2">
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
