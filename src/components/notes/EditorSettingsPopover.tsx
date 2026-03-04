'use client';

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import type { FontFamily, TextColor } from '@/contexts/SettingsContext';

const fontFamilies: FontFamily[] = ['sans', 'serif', 'mono'];
const fontLabels: Record<FontFamily, string> = {
  sans: 'Sans',
  serif: 'Serif',
  mono: 'Mono',
};

const textColors: TextColor[] = ['default', 'indigo', 'emerald', 'amber', 'rose', 'slate'];
// Light-mode hex values used for the swatch circles
const swatchColor: Record<TextColor, string> = {
  default: '#111827',
  indigo:  '#3730a3',
  emerald: '#065f46',
  amber:   '#92400e',
  rose:    '#881337',
  slate:   '#334155',
};

export function EditorSettingsPopover() {
  const { fontFamily, textColor, setFontFamily, setTextColor } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded px-2 py-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
        aria-label="Editor display settings"
      >
        Aa
      </button>

      {open && (
        <>
          {/* Backdrop to close popover on outside click */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-9 z-20 w-52 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-3 shadow-lg dark:shadow-black/40">
            {/* Font section */}
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Font</p>
            <div className="mb-4 flex gap-1">
              {fontFamilies.map((f) => (
                <button
                  key={f}
                  onClick={() => setFontFamily(f)}
                  className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                    fontFamily === f
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-stone-700'
                  }`}
                >
                  {fontLabels[f]}
                </button>
              ))}
            </div>

            {/* Color section */}
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Color</p>
            <div className="flex gap-2">
              {textColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  aria-label={c}
                  style={{ backgroundColor: swatchColor[c] }}
                  className={`h-5 w-5 rounded-full transition-all ${
                    textColor === c
                      ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-stone-800'
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
