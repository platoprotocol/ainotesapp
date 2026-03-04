import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/notes');

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <SparkIcon />
            <span className="text-lg font-bold tracking-tight text-indigo-600">Logan&apos;s List</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-12">

          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 mb-6">
              <SparkIcon className="h-3 w-3" /> AI-powered note taking
            </span>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Think clearer.<br />
              <span className="text-indigo-600">Write faster.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-500 max-w-lg mx-auto lg:mx-0">
              Notes that understand you. Auto-summaries generate as you write, smart titles appear instantly, and your voice transcribes directly to text.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                Start for free — no card needed
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">Free plan includes 20 AI requests/month</p>
          </div>

          {/* Right: app mockup */}
          <div className="flex-1 w-full max-w-xl">
            <AppMockup />
          </div>
        </div>
      </section>

      {/* ── Social proof strip ──────────────────────────── */}
      <div className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              ['✦', 'Auto-summaries'],
              ['🎙', 'Voice to text'],
              ['✨', 'AI rewriting'],
              ['#', 'Smart tagging'],
              ['💬', 'Ask AI'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-3 text-slate-500">Powerful AI features that stay out of the way until you need them.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <SummaryIcon />,
              color: 'bg-violet-50 text-violet-600',
              title: 'Automatic Summaries',
              desc: 'As your note grows, a concise AI summary appears at the top — no button needed. Always know what your note is about at a glance.',
            },
            {
              icon: <MicIcon />,
              color: 'bg-red-50 text-red-600',
              title: 'Voice Transcription',
              desc: 'Click the mic, speak your thoughts, and your words appear in the note. Powered by OpenAI Whisper — accurate and fast.',
            },
            {
              icon: <TitleIcon />,
              color: 'bg-emerald-50 text-emerald-600',
              title: 'Smart Auto-titles',
              desc: 'Leave the title blank and keep writing. Once you\'ve written enough, a fitting title appears automatically.',
            },
            {
              icon: <ImproveIcon />,
              color: 'bg-indigo-50 text-indigo-600',
              title: 'Improve Writing',
              desc: 'One click rewrites your note with better grammar, clearer structure, and improved flow — preserving your meaning.',
            },
            {
              icon: <ExpandIcon />,
              color: 'bg-amber-50 text-amber-600',
              title: 'Expand & Continue',
              desc: 'Stuck mid-thought? AI continues writing from where you left off with coherent, contextual paragraphs.',
            },
            {
              icon: <ChatIcon />,
              color: 'bg-sky-50 text-sky-600',
              title: 'Chat with Your Notes',
              desc: 'Ask questions about what you\'ve written. Get answers, clarifications, and ideas without leaving the editor.',
            },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-sm transition-all">
              <div className={`inline-flex rounded-xl p-2.5 mb-4 ${color}`}>
                {icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────── */}
      <section id="pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-slate-500">Start free. Upgrade when you need more.</p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Free</p>
              <p className="mt-3 text-4xl font-extrabold text-slate-900">$0</p>
              <p className="mt-1 text-sm text-slate-500">Forever free</p>
              <ul className="mt-8 space-y-3 text-sm text-slate-600">
                {['Unlimited notes', '20 AI requests / month', 'Voice transcription', 'Auto-summaries & titles'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckIcon className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-8 block w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-indigo-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">Pro</p>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">Most popular</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold">$7</p>
              <p className="mt-1 text-sm text-indigo-200">per month</p>
              <ul className="mt-8 space-y-3 text-sm text-indigo-100">
                {['Unlimited notes', 'Unlimited AI requests', 'Voice transcription', 'Auto-summaries & titles', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckIcon className="text-white" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-8 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Start with Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Your best thinking starts here.
        </h2>
        <p className="mt-4 text-slate-500 max-w-md mx-auto">
          Join and start capturing ideas with AI that works quietly in the background.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          Create your free account
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <SparkIcon />
            <span className="text-sm font-bold text-indigo-600">Logan&apos;s List</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Logan&apos;s List. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── App Mockup ─────────────────────────────────────────── */
function AppMockup() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-3 flex-1 rounded-md bg-white border border-slate-200 px-3 py-1 text-xs text-slate-400">
          loganslist.app
        </div>
      </div>

      {/* App shell */}
      <div className="flex h-80 text-[11px]">
        {/* Sidebar */}
        <div className="w-40 border-r border-slate-100 bg-slate-50 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <span className="font-bold text-indigo-500 text-xs">Logan&apos;s List</span>
            <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">JD</span>
          </div>
          <div className="px-2 py-2">
            <div className="w-full rounded-lg bg-indigo-600 py-1.5 text-center text-white font-medium text-[10px]">+ New note</div>
          </div>
          <div className="flex-1 px-2 space-y-0.5 overflow-hidden">
            {[
              { title: 'Meeting Notes', preview: 'Discussed Q4 roadmap...', active: true },
              { title: 'Project Ideas', preview: 'Build a dashboard...', active: false },
              { title: 'Weekend Plan', preview: 'Hiking trip, groceries...', active: false },
              { title: 'Book Notes', preview: 'Atomic Habits — key...', active: false },
            ].map((note) => (
              <div key={note.title} className={`rounded-lg px-2 py-1.5 cursor-pointer ${note.active ? 'bg-indigo-50' : 'hover:bg-slate-100'}`}>
                <p className={`font-medium truncate ${note.active ? 'text-indigo-900' : 'text-slate-700'}`}>{note.title}</p>
                <p className="truncate text-slate-400 text-[9px] mt-0.5">{note.preview}</p>
              </div>
            ))}
          </div>
          {/* Usage badge */}
          <div className="border-t border-slate-100 px-3 py-2">
            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
              <span>8/20 AI requests</span>
              <span className="text-indigo-500 font-medium">Upgrade</span>
            </div>
            <div className="h-1 rounded-full bg-slate-200"><div className="h-full w-2/5 rounded-full bg-indigo-500" /></div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <div />
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-500 border border-slate-200 text-[9px]">
                🎙 Transcribe
              </span>
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-500 border border-slate-200 text-[9px]">
                💬 Chat
              </span>
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-indigo-600 bg-indigo-50 border border-indigo-200 text-[9px]">
                ✦ AI
              </span>
              <span className="text-[9px] text-emerald-500 font-medium">Saved</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-5 py-4 flex flex-col">
            {/* Title */}
            <p className="font-bold text-slate-800 text-sm mb-3">Meeting Notes — Q4 Planning</p>

            {/* AI Summary card */}
            <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-indigo-500">✦</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-indigo-600">AI Summary</span>
              </div>
              <p className="text-[9px] leading-relaxed text-slate-600">
                The team reviewed Q4 priorities focusing on product launch, hiring two engineers, and the redesign of the onboarding flow before year-end.
              </p>
            </div>

            {/* Note body */}
            <div className="text-[9px] leading-relaxed text-slate-500 space-y-1.5">
              <p>Discussed the Q4 roadmap and sprint planning with the team. Key items included the upcoming product launch scheduled for November...</p>
              <p>Action items: finalize designs by Oct 15, begin hiring for two senior engineers, and coordinate with marketing on launch strategy...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────── */
function SparkIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={`${className} text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 flex-shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function SummaryIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function MicIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
}
function TitleIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
}
function ImproveIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
}
function ExpandIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
function ChatIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A8.66 8.66 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
