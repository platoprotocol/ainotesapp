'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { signUp } from '@/lib/auth';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
          <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
        <p className="mt-2 text-sm text-slate-500">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-amber-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">Free forever. No credit card required.</p>
      </div>

      <GoogleSignInButton />

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-amber-200" />
        <span className="text-xs text-slate-400">or continue with email</span>
        <div className="flex-1 border-t border-amber-200" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Input id="email" label="Email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <Input id="password" label="Password" type="password" placeholder="Min. 6 characters" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        <Button type="submit" loading={loading} className="w-full mt-1">
          Create free account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-amber-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
