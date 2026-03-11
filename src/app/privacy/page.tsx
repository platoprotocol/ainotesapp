import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy — Logan's List",
  description: "Privacy policy for Logan's List, an AI-powered note-taking app.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-indigo-600">
            Logan&apos;s List
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: March 10, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Overview</h2>
            <p>
              Logan&apos;s List (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website loganslist.app. This page explains
              how we collect, use, and protect your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Information We Collect</h2>
            <p>We collect the following information when you use Logan&apos;s List:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account information:</strong> email address and password (stored securely via Supabase).</li>
              <li><strong>Notes content:</strong> the text and voice recordings you create within the app.</li>
              <li><strong>Usage data:</strong> number of AI requests made, plan type, and feature usage.</li>
              <li><strong>Device and log data:</strong> IP address, browser type, and pages visited, collected automatically.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To provide, maintain, and improve the service.</li>
              <li>To process your notes through OpenAI&apos;s API for AI-powered features (summaries, transcription, etc.).</li>
              <li>To manage billing and subscriptions via Stripe.</li>
              <li>To enforce usage limits and prevent abuse.</li>
              <li>To send essential service-related communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">4. Advertising</h2>
            <p>
              We use Google AdSense to display advertisements on our site. Google AdSense uses cookies to serve ads
              based on your prior visits to this website and other sites on the internet. Google&apos;s use of advertising
              cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on
              the internet.
            </p>
            <p className="mt-2">
              You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of third-party vendor use of cookies by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                aboutads.info
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">5. Third-Party Services</h2>
            <p>We share data with the following third-party providers only as necessary to operate the service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — authentication and database hosting.</li>
              <li><strong>OpenAI</strong> — AI processing of note content (summaries, transcription, rewriting).</li>
              <li><strong>Stripe</strong> — payment processing for Pro subscriptions.</li>
              <li><strong>Google AdSense</strong> — advertising (see Section 4).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">6. Cookies</h2>
            <p>
              We use cookies to maintain your session and authentication state. Third-party advertising partners
              (including Google) may also set cookies on your device. You can control cookies through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">7. Data Retention</h2>
            <p>
              We retain your account data and notes for as long as your account is active. You may delete your notes
              at any time within the app. To delete your account and all associated data, contact us at the email
              below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">8. Security</h2>
            <p>
              We use industry-standard security measures including encrypted connections (HTTPS), secure authentication
              via Supabase, and restricted database access. No method of transmission over the internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">9. Children&apos;s Privacy</h2>
            <p>
              Logan&apos;s List is not directed at children under 13. We do not knowingly collect personal information
              from children under 13. If you believe a child has provided us with personal information, please contact
              us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated date.
              Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">11. Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
              <a href="mailto:privacy@loganslist.app" className="text-indigo-600 hover:underline">
                privacy@loganslist.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 mt-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-bold text-indigo-600">Logan&apos;s List</Link>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Logan&apos;s List. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
