import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'brightcone-theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = useMemo(() => theme === 'dark', [theme]);
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, isDark, toggleTheme };
}
