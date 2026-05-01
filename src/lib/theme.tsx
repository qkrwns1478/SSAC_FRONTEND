'use client';

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

// ── 외부 저장소 (localStorage + system preference) ──────────────────���───────

const themeSubscribers = new Set<() => void>();

function subscribeTheme(callback: () => void): () => void {
  themeSubscribers.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'theme') callback();
  };
  const handleMediaChange = () => callback();
  window.addEventListener('storage', handleStorage);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleMediaChange);
  return () => {
    themeSubscribers.delete(callback);
    window.removeEventListener('storage', handleStorage);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleMediaChange);
  };
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeServerSnapshot(): Theme {
  return 'light';
}

// ── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const toggleTheme = useCallback(() => {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current: Theme =
      stored === 'dark' || stored === 'light' ? stored : systemDark ? 'dark' : 'light';
    const next: Theme = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    themeSubscribers.forEach((cb) => cb());
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
