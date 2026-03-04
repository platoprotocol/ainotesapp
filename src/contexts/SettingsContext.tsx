'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type FontFamily = 'sans' | 'serif' | 'mono';
export type TextColor = 'default' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';

interface EditorSettings {
  fontFamily: FontFamily;
  textColor: TextColor;
}

interface SettingsContextValue extends EditorSettings {
  setFontFamily: (f: FontFamily) => void;
  setTextColor: (c: TextColor) => void;
  resolvedColor: string;
  fontFamilyValue: string;
}

const colorMap: Record<TextColor, { light: string; dark: string }> = {
  default: { light: '#111827', dark: '#f3f4f6' },
  indigo:  { light: '#3730a3', dark: '#a5b4fc' },
  emerald: { light: '#065f46', dark: '#6ee7b7' },
  amber:   { light: '#92400e', dark: '#fcd34d' },
  rose:    { light: '#881337', dark: '#fda4af' },
  slate:   { light: '#334155', dark: '#94a3b8' },
};

const fontMap: Record<FontFamily, string> = {
  sans:  'Inter, system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono:  '"Courier New", Courier, monospace',
};

const defaultSettings: EditorSettings = {
  fontFamily: 'sans',
  textColor: 'default',
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaultSettings,
  setFontFamily: () => {},
  setTextColor: () => {},
  resolvedColor: colorMap.default.light,
  fontFamilyValue: fontMap.sans,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontFamily, setFontFamily] = useState<FontFamily>(defaultSettings.fontFamily);
  const [textColor, setTextColor] = useState<TextColor>(defaultSettings.textColor);
  const [isDark, setIsDark] = useState(false);

  // Load from localStorage (SSR-safe — runs only on client)
  useEffect(() => {
    const stored = localStorage.getItem('editorSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<EditorSettings>;
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
        if (parsed.textColor) setTextColor(parsed.textColor);
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify({ fontFamily, textColor }));
  }, [fontFamily, textColor]);

  // Detect and track system dark mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedColor = colorMap[textColor][isDark ? 'dark' : 'light'];
  const fontFamilyValue = fontMap[fontFamily];

  return (
    <SettingsContext.Provider
      value={{ fontFamily, setFontFamily, textColor, setTextColor, resolvedColor, fontFamilyValue }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
