'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { NotesProvider } from '@/contexts/NotesContext';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isNoteView = /^\/notes\/.+/.test(pathname);

  return (
    <NotesProvider>
      <div className="flex h-svh overflow-hidden bg-paper">
        {/* Sidebar: always on desktop, hidden on mobile when editing a note */}
        <div className={`w-full md:w-64 md:flex-shrink-0 flex-col ${isNoteView ? 'hidden md:flex' : 'flex'}`}>
          <Sidebar />
        </div>
        {/* Main content */}
        <div className={`flex-1 flex-col overflow-hidden ${!isNoteView ? 'hidden md:flex' : 'flex'}`}>
          {children}
        </div>
      </div>
    </NotesProvider>
  );
}
