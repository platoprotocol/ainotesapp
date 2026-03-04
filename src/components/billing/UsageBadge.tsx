'use client';

import { useState } from 'react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { FREE_TIER_LIMIT } from '@/types';

interface UsageBadgeProps {
  onUpgradeClick: () => void;
}

export function UsageBadge({ onUpgradeClick }: UsageBadgeProps) {
  const { plan, usage, loading } = useUserPlan();
  const [billingLoading, setBillingLoading] = useState(false);

  if (loading || !plan) return null;

  if (plan.plan === 'pro') {
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
      <div className="px-3 py-3 border-t border-amber-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Pro plan</span>
          <button
            onClick={handleManageBilling}
            disabled={billingLoading}
            className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline disabled:opacity-50"
          >
            {billingLoading ? 'Loading…' : 'Manage billing'}
          </button>
        </div>
      </div>
    );
  }

  const count = usage?.count ?? 0;
  const pct = Math.min((count / FREE_TIER_LIMIT) * 100, 100);
  const nearLimit = count >= FREE_TIER_LIMIT - 5;

  return (
    <div className="px-3 py-3 border-t border-amber-200 dark:border-stone-700">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {count}/{FREE_TIER_LIMIT} AI requests
        </span>
        <button
          onClick={onUpgradeClick}
          className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
        >
          Upgrade
        </button>
      </div>
      <div className="h-1.5 w-full rounded-full bg-amber-100 dark:bg-stone-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            nearLimit ? 'bg-red-500' : 'bg-amber-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
