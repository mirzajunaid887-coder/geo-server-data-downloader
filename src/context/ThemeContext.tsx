import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The currently active theme, derived from the OS preference. */
  theme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * ThemeProvider
 * -------------
 * Automatically follows the user's OS-level theme preference
 * (via `prefers-color-scheme`) and keeps it in sync when the user
 * changes it while the app is open. No manual toggle, no localStorage.
 *
 * The active theme is reflected on <html data-theme="...">, which is
 * what all the CSS variables in globals.css key off of.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Subscribe to OS theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(mq.matches ? 'dark' : 'light');

    // Ensure state is in sync on mount (covers SSR edge cases)
    handleChange();

    // Modern browsers
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Reflect the theme on <html> whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}