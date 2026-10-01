import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/* ---- Convenience breakpoint hooks (match the CSS breakpoints) ---- */

/** True when viewport is < 640px (small phones) */
export const useIsSmallMobile = () => useMediaQuery('(max-width: 639px)');

/** True when viewport is < 768px (all phones) */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

/** True when viewport is 768px–1023px (tablets) */
export const useIsTablet = () =>
  useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

/** True when viewport is >= 1024px (desktop) */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');