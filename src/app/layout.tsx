import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Logan's List",
  description: 'Cloud-based notes app',
  other: {
    'google-adsense-account': 'ca-pub-4125872061932966',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4125872061932966" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </SettingsProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
