import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      {/* Left panel — brand + value props (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-12 py-12">
        <Link href="/" className="flex items-center gap-2">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-lg font-bold text-white">Logan&apos;s List</span>
        </Link>

        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Your notes,<br />supercharged by AI.
          </h1>
          <p className="mt-4 text-amber-100 text-base leading-relaxed max-w-sm">
            Automatic summaries, voice transcription, smart titles — all working quietly in the background so you can focus on thinking.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              ['✦', 'Auto-summaries as you write'],
              ['🎙', 'Voice to text with Whisper'],
              ['✨', 'AI writing improvements'],
              ['💬', 'Chat with your notes'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-base">
                  {icon}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-rose-200">© {new Date().getFullYear()} Logan&apos;s List</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-lg font-bold text-amber-600">Logan&apos;s List</span>
        </Link>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
