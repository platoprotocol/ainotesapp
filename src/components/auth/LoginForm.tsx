'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { signIn } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/notes');
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue to Logan&apos;s List</p>
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
        <Input id="password" label="Password" type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        <Button type="submit" loading={loading} className="w-full mt-1">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-amber-600 hover:underline">Create one free</Link>
      </p>
    </div>
  );
}
