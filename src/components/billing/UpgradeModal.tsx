'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { apiUrl } from '@/lib/apiUrl';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: 'limit_reached' | 'manual';
}

export function UpgradeModal({ open, onClose, trigger = 'manual' }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const headline = trigger === 'limit_reached' ? "You've hit your free limit" : 'Upgrade to Pro';
  const sub = trigger === 'limit_reached'
    ? 'Upgrade to Pro to continue using AI features this month.'
    : 'Unlock unlimited AI features for $7/month.';

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/stripe/checkout'), { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-paper border border-wire shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-wire text-center">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink">{headline}</h2>
          <p className="mt-1 text-sm text-ink/50">{sub}</p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 divide-x divide-wire px-8 py-6">
          <div className="pr-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-4">Free</p>
            <ul className="space-y-2.5 text-sm text-ink/70">
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Unlimited notes</li>
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> 20 AI requests / month</li>
              <li className="flex gap-2"><span className="text-wire mt-0.5">✕</span> <span className="text-ink/30">Unlimited AI</span></li>
              <li className="flex gap-2"><span className="text-wire mt-0.5">✕</span> <span className="text-ink/30">Voice transcription</span></li>
            </ul>
            <p className="mt-5 text-xl font-bold text-ink">$0</p>
          </div>
          <div className="pl-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Pro</p>
            <ul className="space-y-2.5 text-sm text-ink/70">
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Unlimited notes</li>
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Unlimited AI requests</li>
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Voice transcription</li>
              <li className="flex gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Priority support</li>
            </ul>
            <p className="mt-5 text-xl font-bold text-ink">$7 <span className="text-sm font-normal text-ink/40">/ month</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-end gap-3 border-t border-wire pt-5">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Maybe later</Button>
          <Button onClick={handleUpgrade} disabled={loading}>
            {loading ? 'Redirecting…' : 'Upgrade to Pro →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
